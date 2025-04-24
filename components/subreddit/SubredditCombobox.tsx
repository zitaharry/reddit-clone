"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Check } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { GetSubredditsQueryResult } from "@/sanity.types";
import { useRouter } from "next/navigation";

interface SubredditComboboxProps {
  subreddits: GetSubredditsQueryResult;
  defaultValue?: string;
}

export const SubredditCombobox = ({
  subreddits,
  defaultValue = "",
}: SubredditComboboxProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  // Handle selection of a subreddit
  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
    // Update the URL query parameter
    if (currentValue) {
      router.push(`/create-post?subreddit=${currentValue}`);
    } else {
      router.push(`/create-post`);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? subreddits.find((subreddit) => subreddit.title === value)
                ?.title || "Select a community"
            : "Select a community"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search community..." />
          <CommandList>
            <CommandEmpty>No subreddit found.</CommandEmpty>
            <CommandGroup>
              {subreddits.map((subreddit) => (
                <CommandItem
                  key={subreddit._id}
                  value={subreddit.title ?? ""}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === subreddit.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {subreddit.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
