import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_ADMIN_TOKEN,
});
