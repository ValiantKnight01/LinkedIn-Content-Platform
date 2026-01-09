'use client';

import { Post, PostStatus, useCalendarStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer w-full overflow-hidden hover:opacity-80",
            bgStyles[post.status]
        )}>
          <div className={cn("h-2 w-2 rounded-full shrink-0", statusColors[post.status])} />
          <span className="text-[11px] font-semibold text-foreground/80 truncate">{post.title}</span>
        </div>
      </SheetTrigger>
      
      <SheetContent 
        className="w-full sm:max-w-xl bg-[#fefae0] border-l border-primary/20 p-0 gap-0 overflow-hidden" 
        side="right"
      >
        <div className="flex flex-col h-full w-full">
            <SheetHeader className="p-8 pb-4 shrink-0 space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn("capitalize px-3 py-1", bgStyles[post.status])}>
                  {post.status}
                </Badge>
                {post.difficulty && (
                  <Badge variant="outline" className="border-primary/20 text-foreground/60 px-3 py-1">
                    {post.difficulty}
                  </Badge>
                )}
              </div>
              <SheetTitle className="font-serif text-3xl font-bold text-[#3D2B1F] leading-tight">
                {post.title}
              </SheetTitle>
              <SheetDescription className="text-base text-[#6B4F3A] leading-relaxed">
                {post.learning_objective || "No learning objective defined."}
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="flex-1 min-h-0 w-full">
              <div className="px-8 pb-8">
                {/* Research Results */}
                {post.status === 'researched' && post.summary ? (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 font-bold text-lg text-[#3D2B1F]">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        Research Synthesis
                      </h4>
                      <div className="prose prose-sm max-w-none text-[#4A3728] leading-relaxed">
                        {post.summary.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-4 last:mb-0 text-lg">{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    {post.sources && post.sources.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-primary/10">
                        <h4 className="flex items-center gap-2 font-bold text-sm text-foreground/60 uppercase tracking-widest pl-1">
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
                              className="text-xs text-primary underline-offset-4 hover:underline truncate block p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all border border-transparent hover:border-primary/5"
                            >
                              {source}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border-2 border-dashed border-primary/10 rounded-[2.5rem] bg-primary/5">
                    <div className="h-20 w-20 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                      <FileText className="h-10 w-10 text-primary/40" />
                    </div>
                    <div className="space-y-2 max-w-xs mx-auto">
                      <p className="font-serif text-2xl font-medium text-[#3D2B1F]">Ready to Research</p>
                      <p className="text-sm text-[#6B4F3A] leading-relaxed">
                        Generate a detailed summary and collect authoritative sources for this topic.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <SheetFooter className="p-8 pt-4 border-t border-primary/10 bg-inherit shrink-0">
                 {post.status !== 'researched' || !post.summary ? (
                    <Button 
                      onClick={handleResearch} 
                      disabled={isResearching}
                      className="w-full h-14 rounded-full bg-[#3D2B1F] text-[#fefae0] hover:bg-[#2a1e16] text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      {isResearching ? (
                        <>
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Researching Topic...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-6 w-6" />
                          Start Deep Research
                        </>
                      )}
                    </Button>
                 ) : (
                     <div className="w-full flex justify-between items-center text-sm text-muted-foreground px-2">
                        <span className="font-medium">Research Complete</span>
                        <span className="opacity-50">Drafting module locked</span>
                     </div>
                 )}
            </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
