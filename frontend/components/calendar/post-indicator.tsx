'use client';

import { Post, PostStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

const statusColors: Record<PostStatus, string> = {
  draft: "bg-yellow-400",
  "in-progress": "bg-blue-400",
  scheduled: "bg-green-500",
};

export function PostIndicator({ post }: { post: Post }) {
  const bgStyles: Record<PostStatus, string> = {
    draft: "bg-yellow-100/50 border-yellow-200",
    "in-progress": "bg-blue-100/50 border-blue-200",
    scheduled: "bg-green-100/50 border-green-200",
  };

  return (
    <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer w-full overflow-hidden",
        bgStyles[post.status]
    )}>
      <div className={cn("h-2 w-2 rounded-full shrink-0", statusColors[post.status])} />
      <span className="text-[11px] font-semibold text-foreground/80 truncate">{post.title}</span>
    </div>
  );
}
