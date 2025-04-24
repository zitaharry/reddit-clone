"use server";

import { Post } from "@/sanity.types";
import { adminClient } from "@/sanity/lib/adminClient";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import { getUser } from "@/sanity/lib/user/getUser";
import { auth } from "@clerk/nextjs/server";
import { CoreMessage, generateText } from "ai";
import { createClerkToolkit } from "@clerk/agent-toolkit/ai-sdk";
import { openai } from "@ai-sdk/openai";
import { censorPost, reportUser } from "@/tools/tools";
import { systemPrompt } from "@/tools/prompt";

export type PostImageData = {
  base64: string;
  filename: string;
  contentType: string;
} | null;

export async function createPost({
  title,
  subredditSlug,
  body,
  imageBase64,
  imageFilename,
  imageContentType,
}: {
  title: string;
  subredditSlug: string;
  body?: string;
  imageBase64?: string | null;
  imageFilename?: string | null;
  imageContentType?: string | null;
}) {
  try {
    console.log("Starting post creation process");
    if (!title || !subredditSlug) {
      console.log("Missing required fields: title or subredditSlug");
      return { error: "Title and subreddit are required" };
    }

    console.log(
      `Creating post with title: "${title}" in subreddit: "${subredditSlug}"`
    );
    const user = await getUser();

    if ("error" in user) {
      console.log("User authentication error:", user.error);
      return { error: user.error };
    }
    console.log("User authenticated:", user._id);

    // Find the subreddit document by name
    console.log(`Looking up subreddit with slug: "${subredditSlug}"`);
    const subreddit = await getSubredditBySlug(subredditSlug);

    if (!subreddit?._id) {
      console.log(`Subreddit "${subredditSlug}" not found`);
      return { error: `Subreddit "${subredditSlug}" not found` };
    }
    console.log(`Found subreddit: ${subreddit._id}`);

    // Prepare image data if provided
    let imageAsset;
    if (imageBase64 && imageFilename && imageContentType) {
      console.log(`Image provided: ${imageFilename} (${imageContentType})`);
      console.log(`Image base64 length: ${imageBase64.length} characters`);
      try {
        console.log("Processing image data...");
        // Extract base64 data (remove data:image/jpeg;base64, part)
        const base64Data = imageBase64.split(",")[1];
        console.log(`Extracted base64 data (${base64Data.length} characters)`);

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");
        console.log(`Converted to buffer (size: ${buffer.length} bytes)`);

        // Upload to Sanity
        console.log(`Uploading image to Sanity: ${imageFilename}`);
        imageAsset = await adminClient.assets.upload("image", buffer, {
          filename: imageFilename,
          contentType: imageContentType,
        });
        console.log(`Image uploaded successfully with ID: ${imageAsset._id}`);
      } catch (error) {
        console.error("Error uploading image:", error);
        console.log("Will continue post creation without image");
        // Continue without image if upload fails
      }
    } else {
      console.log("No image provided with post");
    }

    // Create the post
    console.log("Preparing post document");
    const postDoc: Partial<Post> = {
      _type: "post",
      title,
      body: body
        ? [
            {
              _type: "block",
              _key: Date.now().toString(),
              children: [
                {
                  _type: "span",
                  _key: Date.now().toString() + "1",
                  text: body,
                },
              ],
            },
          ]
        : undefined,
      author: {
        _type: "reference",
        _ref: user._id,
      },
      subreddit: {
        _type: "reference",
        _ref: subreddit._id,
      },
      publishedAt: new Date().toISOString(),
    };

    // Add image if available
    if (imageAsset) {
      console.log(`Adding image reference to post: ${imageAsset._id}`);
      postDoc.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };
    }

    console.log("Creating post in Sanity database");
    const post = await adminClient.create(postDoc as Post);
    console.log(`Post created successfully with ID: ${post._id}`);

    // Call the content moderation API
    // ----- MOD STEP ----
    // TODO: Implement content moderation API call

    console.log("Starting content moderation process");
    const messages: CoreMessage[] = [
      {
        role: "user",
        content: `I posted this post -> Post ID: ${post._id}\nTitle: ${title}\nBody: ${body}`,
      },
    ];

    console.log("Prepared messages for moderation:", JSON.stringify(messages));

    try {
      const authContext = await auth.protect();
      const toolkit = await createClerkToolkit({ authContext });
      const result = await generateText({
        model: openai("gpt-4.1-mini"),
        messages: messages as CoreMessage[],
        // Conditionally inject session claims if we have auth context
        system: toolkit.injectSessionClaims(systemPrompt),
        tools: {
          ...toolkit.users(),
          censorPost,
          reportUser,
        },
      });

      console.log("AI moderation completed successfully", result);
    } catch (error) {
      console.error("Error in content moderation:", error);
      // Don't fail the whole post creation if moderation fails
      console.log("Continuing without content moderation");
    }

    // ----- END MOD STEP ----

    console.log("Post creation process completed successfully", post);

    return { post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post" };
  }
}
