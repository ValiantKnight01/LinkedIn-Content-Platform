'use client';

import { Post, PostStatus, useCalendarStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, FileText, Globe } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<PostStatus, string> = {
  draft: "bg-yellow-400",
  "in-progress": "bg-blue-400",
  scheduled: "bg-green-500",
  planned: "bg-purple-400",
  researched: "bg-indigo-500",
  proposed: "bg-gray-400",
  selected: "bg-pink-400",
  inDraft: "bg-orange-400",
};

const bgStyles: Record<PostStatus, string> = {
  draft: "bg-yellow-100/50 border-yellow-200",
  "in-progress": "bg-blue-100/50 border-blue-200",
  scheduled: "bg-green-100/50 border-green-200",
  planned: "bg-purple-100/50 border-purple-200",
  researched: "bg-indigo-100/50 border-indigo-200",
  proposed: "bg-gray-100/50 border-gray-200",
  selected: "bg-pink-100/50 border-pink-200",
  inDraft: "bg-orange-100/50 border-orange-200",
};

export function PostIndicator({ post }: { post: Post }) {
  const { researchPost } = useCalendarStore();
  const [isResearching, setIsResearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleResearch = async () => {
    setIsResearching(true);
    await researchPost(post.id);
    setIsResearching(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer w-full overflow-hidden hover:opacity-80",
            bgStyles[post.status]
        )}>
          <div className={cn("h-2 w-2 rounded-full shrink-0", statusColors[post.status])} />
          <span className="text-[11px] font-semibold text-foreground/80 truncate">{post.title}</span>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-[#fefae0] border-primary/20 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className={cn("capitalize", bgStyles[post.status])}>
              {post.status}
            </Badge>
            {post.difficulty && (
              <Badge variant="outline" className="border-primary/20 text-foreground/60">
                {post.difficulty}
              </Badge>
            )}
          </div>
          <DialogTitle className="font-serif text-3xl font-bold text-[#3D2B1F] leading-tight">
            {post.title}
          </DialogTitle>
          <DialogDescription className="text-base text-[#6B4F3A] mt-2">
            {post.learning_objective || "No learning objective defined."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 py-4">
            {/* Research Results */}
            {post.status === 'researched' && post.summary ? (
              <div className="space-y-4">
                <div className="bg-white/50 p-6 rounded-2xl border border-primary/10">
                  <h4 className="flex items-center gap-2 font-bold text-lg text-[#3D2B1F] mb-3">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    Research Synthesis
                  </h4>
                  <div className="prose prose-sm max-w-none text-[#4A3728] leading-relaxed">
                    {post.summary.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {post.sources && post.sources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 font-bold text-sm text-foreground/60 uppercase tracking-widest">
                      <Globe className="h-4 w-4" />
                      Sources
                    </h4>
                    <div className="grid gap-2">
                      {post.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary underline-offset-4 hover:underline truncate block p-2 rounded-lg bg-white/30 hover:bg-white/50 transition-colors"
                        >
                          {source}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed border-primary/10 rounded-2xl">
                <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary/40" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground/70">Ready to Research</p>
                  <p className="text-sm text-muted-foreground">
                    Generate a detailed summary and collect sources for this topic.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t border-primary/10">
          <div className="flex w-full justify-between items-center">
             <div className="text-xs text-muted-foreground">
               Day {post.date ? new Date(post.date).getDate() : 'N/A'} of Curriculum
             </div>
             
             {post.status !== 'researched' || !post.summary ? (
                <Button 
                  onClick={handleResearch} 
                  disabled={isResearching}
                  className="rounded-full bg-[#3D2B1F] text-[#fefae0] hover:bg-[#2a1e16]"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Deep Research
                    </>
                  )}
                </Button>
             ) : (
                 <Button variant="outline" className="rounded-full border-primary/20">
                    Draft Post (Coming Soon)
                 </Button>
             )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}