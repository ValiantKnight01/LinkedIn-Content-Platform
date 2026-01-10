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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Trash2, Plus, Copy, Check } from "lucide-react";
import { CarouselPreview } from "./carousel-preview";
import { ComparisonEditor } from "./comparison-editor";
import { TradeoffsEditor } from "./tradeoffs-editor";
import { SectionComparison } from "./section-comparison";
import { SectionTradeoffs } from "./section-tradeoffs";

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
  const { researchPost, updatePost } = useCalendarStore();
  const [isResearching, setIsResearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<Post>(post);
  const [copied, setCopied] = useState(false);

  const handleResearch = async () => {
    setIsResearching(true);
    await researchPost(post.id);
    setIsResearching(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updatePost(post.id, editData);
    setIsSaving(false);
  };

  const handleCopy = () => {
    const sections = (editData.sections || [])
      .map(s => {
        let content = s.content || "";
        
        if (s.comparison) {
          content = s.comparison.items.map(item => 
            `• ${item.dimension}: ${item.before} → ${item.after}`
          ).join('\n') + (s.comparison.summary ? `\n\n${s.comparison.summary}` : '');
        } else if (s.tradeoffs) {
          content = `PROS:\n${s.tradeoffs.pros.map(p => `✓ ${p}`).join('\n')}\n\nCONS:\n${s.tradeoffs.cons.map(c => `✗ ${c}`).join('\n')}\n\nCONSTRAINTS:\n${s.tradeoffs.constraints.map(c => `→ ${c}`).join('\n')}${s.tradeoffs.real_world_context ? `\n\nReal-world: ${s.tradeoffs.real_world_context}` : ''}`;
        }

        return `\n${s.header.toUpperCase()}\n${content}${s.example_use_case ? `\n\nExample: ${s.example_use_case}` : ''}`;
      })
      .join('\n\n---\n');

    const takeaways = (editData.key_takeaways || [])
      .map(t => `• ${t}`)
      .join('\n');

    const text = `${editData.hook || ''}\n\n${sections}\n\nKEY TAKEAWAYS\n${takeaways}\n\n${editData.call_to_action || ''}\n\n${(editData.hashtags || []).map(h => `#${h}`).join(' ')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        className="w-full sm:max-w-[50vw] bg-[#fefae0] border-l border-primary/20 p-0 gap-0 overflow-hidden" 
        side="right"
      >
        <Tabs defaultValue="research" className="flex flex-col h-full w-full">
          <div className="px-8 pt-6 pb-2 border-b border-primary/10 shrink-0 bg-[#fefae0] flex items-center justify-between gap-4">
            <TabsList className="grid w-full grid-cols-3 rounded-full bg-[#faedcd] p-1 max-w-md">
              <TabsTrigger value="research" className="rounded-full data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-[#fefae0] data-[state=active]:shadow-sm">Research</TabsTrigger>
              <TabsTrigger value="edit" className="rounded-full data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-[#fefae0] data-[state=active]:shadow-sm">Edit</TabsTrigger>
              <TabsTrigger value="preview" className="rounded-full data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-[#fefae0] data-[state=active]:shadow-sm">Preview</TabsTrigger>
            </TabsList>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="rounded-full border-[#d4a373] text-[#3D2B1F] hover:bg-[#d4a373]/20 h-9 px-4 shrink-0 font-medium"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-700" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" /> Copy Post
                </>
              )}
            </Button>
          </div>

                    <TabsContent value="research" className="flex-1 flex flex-col m-0 overflow-hidden border-none bg-[#fefae0]">

                      <div className="flex flex-col h-full w-full">

                          <SheetHeader className="p-8 pb-4 shrink-0 space-y-4 text-left">

          
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
                {post.status === 'researched' && (post.summary || post.hook) ? (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                      <h4 className="flex items-center gap-2 font-bold text-lg text-[#3D2B1F]">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        Research Synthesis
                      </h4>
                      
                      {/* New Structured Fields */}
                      {post.hook && (
                        <div className="space-y-2">
                          <p className="text-xl font-medium text-[#3D2B1F] italic leading-relaxed">
                            "{post.hook}"
                          </p>
                        </div>
                      )}

                      {post.sections && post.sections.length > 0 && (
                        <div className="space-y-8 py-4">
                          {post.sections.map((section, idx) => (
                            <div key={idx} className="space-y-4 p-6 rounded-[2rem] bg-white/40 border border-primary/5 shadow-sm">
                              <h5 className="font-serif text-xl font-bold text-[#3D2B1F]">
                                {section.header}
                              </h5>
                              
                              {section.comparison ? (
                                <SectionComparison comparison={section.comparison} />
                              ) : section.tradeoffs ? (
                                <SectionTradeoffs tradeoffs={section.tradeoffs} />
                              ) : (
                                <p className="text-[#4A3728] text-lg leading-relaxed">
                                  {section.content}
                                </p>
                              )}

                              {section.example_use_case && (
                                <p className="text-sm text-[#6B4F3A] bg-black/5 p-3 rounded-xl italic">
                                  Example: {section.example_use_case}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {post.key_takeaways && post.key_takeaways.length > 0 && (
                        <div className="space-y-3 p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100">
                          <p className="font-bold text-sm text-indigo-900 uppercase tracking-widest mb-2">Key Takeaways</p>
                          <ul className="space-y-2">
                            {post.key_takeaways.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[#4A3728] text-lg leading-relaxed">
                                <span className="text-indigo-500 shrink-0 mt-1">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {post.call_to_action && (
                        <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                          <p className="font-serif text-xl font-medium text-[#3D2B1F] text-center">
                            {post.call_to_action}
                          </p>
                        </div>
                      )}

                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {post.hashtags.map((tag, idx) => (
                            <span key={idx} className="text-sm font-medium text-indigo-600">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Legacy Summary Fallback */}
                      {!post.hook && post.summary && (
                        <div className="prose prose-sm max-w-none text-[#4A3728] leading-relaxed">
                          {post.summary.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-4 last:mb-0 text-lg">{paragraph}</p>
                          ))}
                        </div>
                      )}
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
                 {post.status !== 'researched' || (!post.summary && !post.hook) ? (
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
                      </TabsContent>
            
                                          <TabsContent value="edit" className="flex-1 m-0 overflow-hidden border-none flex flex-col min-h-0 bg-[#fefae0]">
            
                                            <ScrollArea className="flex-1 h-full">
            
                                              <div className="p-8 space-y-8">
            
                                
                                      <div className="grid gap-6">
                                        <div className="space-y-2">
                                          <Label htmlFor="title" className="text-[#3D2B1F] font-bold uppercase tracking-wider text-xs">Post Title</Label>
                                          <Input 
                                            id="title" 
                                            value={editData.title} 
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="bg-[#faedcd]/30 border-[#d4a373]/40 focus:border-[#d4a373] focus:ring-[#d4a373]/20 text-[#3D2B1F] rounded-xl h-11 transition-all"
                                          />
                                        </div>
                      
                                        <div className="space-y-2">
                                          <Label htmlFor="hook" className="text-[#3D2B1F] font-bold uppercase tracking-wider text-xs">Hook (First Line)</Label>
                                          <Textarea 
                                            id="hook" 
                                            value={editData.hook || ""} 
                                            onChange={(e) => setEditData({ ...editData, hook: e.target.value })}
                                            className="bg-[#faedcd]/30 border-[#d4a373]/40 focus:border-[#d4a373] focus:ring-[#d4a373]/20 min-h-[100px] text-[#3D2B1F] rounded-xl transition-all"
                                            placeholder="Enter a thumb-stopping hook..."
                                          />
                                        </div>
                      
                                        <div className="space-y-2">
                                          <Label htmlFor="learning_objective" className="text-[#3D2B1F] font-bold uppercase tracking-wider text-xs">Learning Objective</Label>
                                          <Textarea 
                                            id="learning_objective" 
                                            value={editData.learning_objective || ""} 
                                            onChange={(e) => setEditData({ ...editData, learning_objective: e.target.value })}
                                            className="bg-[#faedcd]/30 border-[#d4a373]/40 focus:border-[#d4a373] focus:ring-[#d4a373]/20 text-[#3D2B1F] rounded-xl transition-all"
                                          />
                                        </div>
                      
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="status" className="text-[#3D2B1F] font-bold uppercase tracking-wider text-xs">Status</Label>
                                            <select 
                                              id="status"
                                              value={editData.status}
                                              disabled
                                              className="w-full h-11 px-3 rounded-xl bg-black/5 border border-[#d4a373]/20 text-[#3D2B1F]/60 cursor-not-allowed font-medium"
                                            >
                                              <option value="planned">Planned</option>
                                              <option value="researched">Researched</option>
                                              <option value="inDraft">In Draft</option>
                                              <option value="scheduled">Scheduled</option>
                                            </select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="difficulty" className="text-[#3D2B1F] font-bold uppercase tracking-wider text-xs">Difficulty</Label>
                                            <Input 
                                              id="difficulty" 
                                              value={editData.difficulty || ""} 
                                              onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
                                              className="bg-[#faedcd]/30 border-[#d4a373]/40 focus:border-[#d4a373] focus:ring-[#d4a373]/20 text-[#3D2B1F] rounded-xl h-11 transition-all"
                                            />
                                          </div>
                                        </div>
                      
                                                          <div className="space-y-2">
                      
                                                            <Label htmlFor="cta" className="text-[#3D2B1F] font-bold uppercase tracking-wider text-xs">Call to Action</Label>
                      
                                                            <Input 
                      
                                                              id="cta" 
                      
                                                              value={editData.call_to_action || ""} 
                      
                                                              onChange={(e) => setEditData({ ...editData, call_to_action: e.target.value })}
                      
                                                              className="bg-[#faedcd]/30 border-[#d4a373]/40 focus:border-[#d4a373] focus:ring-[#d4a373]/20 text-[#3D2B1F] rounded-xl h-11 transition-all"
                      
                                                              placeholder="What should they do next?"
                      
                                                            />
                      
                                                          </div>
                      
                                        
                      
                                                          {/* Dynamic Sections */}
                      
                                                          <div className="space-y-4">
                      
                                                            <div className="flex items-center justify-between">
                      
                                                              <Label className="text-[#3D2B1F] font-bold">Carousel Sections</Label>
                      
                                                              <Button 
                      
                                                                variant="outline" 
                      
                                                                size="sm" 
                      
                                                                onClick={() => setEditData({
                      
                                                                  ...editData,
                      
                                                                  sections: [...(editData.sections || []), { header: "", content: "", example_use_case: "" }]
                      
                                                                })}
                      
                                                                className="rounded-full border-[#d4a373]/30 text-[#3D2B1F] hover:bg-[#d4a373]/10"
                      
                                                              >
                      
                                                                <Plus className="h-4 w-4 mr-1" /> Add Section
                      
                                                              </Button>
                      
                                                            </div>
                      
                                                            
                      
                                                            <div className="space-y-6">
                      
                                                              {editData.sections?.map((section, idx) => (
                      
                                                                <div key={idx} className="p-6 rounded-[1.5rem] bg-white/40 border border-[#d4a373]/20 relative group">
                      
                                                                  <Button
                      
                                                                    variant="ghost"
                      
                                                                    size="icon"
                      
                                                                    onClick={() => setEditData({
                      
                                                                      ...editData,
                      
                                                                      sections: editData.sections?.filter((_, i) => i !== idx)
                      
                                                                    })}
                      
                                                                    className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      
                                                                  >
                      
                                                                    <Trash2 className="h-4 w-4" />
                      
                                                                  </Button>
                      
                                                                  
                      
                                                                                                                                    <div className="space-y-4">
                      
                                                                  
                      
                                                                                                                                      <div className="space-y-2">
                      
                                                                  
                      
                                                                                                                                        <Label className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A]">Slide Header</Label>
                      
                                                                  
                      
                                                                                                                                        <Input 
                      
                                                                  
                      
                                                                                                                                          value={section.header} 
                      
                                                                  
                      
                                                                                                                                          onChange={(e) => {
                      
                                                                  
                      
                                                                                                                                            const newSections = [...(editData.sections || [])];
                      
                                                                  
                      
                                                                                                                                            newSections[idx].header = e.target.value;
                      
                                                                  
                      
                                                                                                                                            setEditData({ ...editData, sections: newSections });
                      
                                                                  
                      
                                                                                                                                          }}
                      
                                                                  
                      
                                                                                                                                          className="bg-[#faedcd]/20 border-[#d4a373]/30 focus:border-[#d4a373] focus:ring-[#d4a373]/20 text-[#3D2B1F] rounded-xl h-10 transition-all"
                      
                                                                  
                      
                                                                                                                                          placeholder="Slide heading..."
                      
                                                                  
                      
                                                                                                                                        />
                      
                                                                  
                      
                                                                                                                                      </div>
                      
                                                                  
                      
                                                                  
                      
                                                                  
                      
                                                                                                                                      {section.comparison ? (
                      
                                                                  
                      
                                                                                                                                        <ComparisonEditor 
                      
                                                                  
                      
                                                                                                                                          data={section.comparison} 
                      
                                                                  
                      
                                                                                                                                          onChange={(newData) => {
                      
                                                                  
                      
                                                                                                                                            const newSections = [...(editData.sections || [])];
                      
                                                                  
                      
                                                                                                                                            newSections[idx].comparison = newData;
                      
                                                                  
                      
                                                                                                                                            setEditData({ ...editData, sections: newSections });
                      
                                                                  
                      
                                                                                                                                          }}
                      
                                                                  
                      
                                                                                                                                        />
                      
                                                                  
                      
                                                                                                                                      ) : section.tradeoffs ? (
                      
                                                                  
                      
                                                                                                                                        <TradeoffsEditor 
                      
                                                                  
                      
                                                                                                                                          data={section.tradeoffs} 
                      
                                                                  
                      
                                                                                                                                          onChange={(newData) => {
                      
                                                                  
                      
                                                                                                                                            const newSections = [...(editData.sections || [])];
                      
                                                                  
                      
                                                                                                                                            newSections[idx].tradeoffs = newData;
                      
                                                                  
                      
                                                                                                                                            setEditData({ ...editData, sections: newSections });
                      
                                                                  
                      
                                                                                                                                          }}
                      
                                                                  
                      
                                                                                                                                        />
                      
                                                                  
                      
                                                                                                                                      ) : (
                      
                                                                  
                      
                                                                                                                                        <div className="space-y-2">
                      
                                                                  
                      
                                                                                                                                          <Label className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A]">Slide Content</Label>
                      
                                                                  
                      
                                                                                                                                          <Textarea 
                      
                                                                  
                      
                                                                                                                                            value={section.content} 
                      
                                                                  
                      
                                                                                                                                            onChange={(e) => {
                      
                                                                  
                      
                                                                                                                                              const newSections = [...(editData.sections || [])];
                      
                                                                  
                      
                                                                                                                                              newSections[idx].content = e.target.value;
                      
                                                                  
                      
                                                                                                                                              setEditData({ ...editData, sections: newSections });
                      
                                                                  
                      
                                                                                                                                            }}
                      
                                                                  
                      
                                                                                                                                            className="bg-[#faedcd]/20 border-[#d4a373]/30 focus:border-[#d4a373] focus:ring-[#d4a373]/20 min-h-[80px] text-[#3D2B1F] rounded-xl transition-all"
                      
                                                                  
                      
                                                                                                                                            placeholder="What's the core message?"
                      
                                                                  
                      
                                                                                                                                          />
                      
                                                                  
                      
                                                                                                                                        </div>
                      
                                                                  
                      
                                                                                                                                      )}
                      
                                                                  
                      
                                                                  
                      
                                                                  
                      
                                                                                                                                      <div className="space-y-2">
                      
                                                                  
                      
                                                                                                                                        <Label className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A]">Example (Optional)</Label>
                      
                                                                  
                      
                                                                                                                                        <Input 
                      
                                                                  
                      
                                                                                                                                          value={section.example_use_case} 
                      
                                                                  
                      
                                                                                                                                          onChange={(e) => {
                      
                                                                  
                      
                                                                                                                                            const newSections = [...(editData.sections || [])];
                      
                                                                  
                      
                                                                                                                                            newSections[idx].example_use_case = e.target.value;
                      
                                                                  
                      
                                                                                                                                            setEditData({ ...editData, sections: newSections });
                      
                                                                  
                      
                                                                                                                                          }}
                      
                                                                  
                      
                                                                                                                                          className="bg-[#faedcd]/20 border-[#d4a373]/30 focus:border-[#d4a373] focus:ring-[#d4a373]/20 text-[#3D2B1F] rounded-xl h-10 transition-all"
                      
                                                                  
                      
                                                                                                                                          placeholder="Real-world example..."
                      
                                                                  
                      
                                                                                                                                        />
                      
                                                                  
                      
                                                                                                                                      </div>
                      
                                                                  
                      
                                                                                                                                    </div>
                      
                                                                  
                      
                                                                  
                      
                                                                </div>
                      
                                                              ))}
                      
                                                            </div>
                      
                                                          </div>
                      
                                        
                      
                                                          {/* Key Takeaways */}
                      
                                                          <div className="space-y-4">
                      
                                                            <div className="flex items-center justify-between">
                      
                                                              <Label className="text-[#3D2B1F] font-bold">Key Takeaways</Label>
                      
                                                              <Button 
                      
                                                                variant="outline" 
                      
                                                                size="sm" 
                      
                                                                onClick={() => setEditData({
                      
                                                                  ...editData,
                      
                                                                  key_takeaways: [...(editData.key_takeaways || []), ""]
                      
                                                                })}
                      
                                                                className="rounded-full border-[#d4a373]/30 text-[#3D2B1F] hover:bg-[#d4a373]/10"
                      
                                                              >
                      
                                                                <Plus className="h-4 w-4 mr-1" /> Add Takeaway
                      
                                                              </Button>
                      
                                                            </div>
                      
                                        
                      
                                                            <div className="space-y-2">
                      
                                                              {editData.key_takeaways?.map((point, idx) => (
                      
                                                                <div key={idx} className="flex gap-2">
                      
                                                                  <Input 
                      
                                                                    value={point} 
                      
                                                                    onChange={(e) => {
                      
                                                                      const newPoints = [...(editData.key_takeaways || [])];
                      
                                                                      newPoints[idx] = e.target.value;
                      
                                                                      setEditData({ ...editData, key_takeaways: newPoints });
                      
                                                                    }}
                      
                                                                    className="bg-[#faedcd]/20 border-[#d4a373]/30 focus:border-[#d4a373] focus:ring-[#d4a373]/20 text-[#3D2B1F] rounded-xl h-10 transition-all"
                      
                                                                    placeholder="A key point to remember..."
                      
                                                                  />
                      
                                                                  <Button
                      
                                                                    variant="ghost"
                      
                                                                    size="icon"
                      
                                                                    onClick={() => setEditData({
                      
                                                                      ...editData,
                      
                                                                      key_takeaways: editData.key_takeaways?.filter((_, i) => i !== idx)
                      
                                                                    })}
                      
                                                                    className="text-destructive shrink-0 hover:bg-destructive/10 rounded-full h-10 w-10"
                      
                                                                  >
                      
                                                                    <Trash2 className="h-4 w-4" />
                      
                                                                  </Button>
                      
                                                                </div>
                      
                                                              ))}
                      
                                                            </div>
                      
                                                          </div>
                      
                                        
                                      </div>
                                    </div>
                                  </ScrollArea>
                                  <div className="p-8 pt-4 border-t border-primary/10 bg-[#fefae0] shrink-0">
                                    <Button 
                                      onClick={handleSave} 
                                      disabled={isSaving}
                                      className="w-full h-14 rounded-full bg-[#3D2B1F] text-[#fefae0] hover:bg-[#2a1e16] text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                    >
                                      {isSaving ? (
                                        <>
                                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                          Saving Changes...
                                        </>
                                      ) : (
                                        <>
                                          <Save className="mr-2 h-6 w-6" />
                                          Save Changes
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </TabsContent>
                                                      <TabsContent value="preview" className="flex-1 m-0 overflow-hidden border-none p-0">
                                                        <CarouselPreview post={editData} />
                                                      </TabsContent>
                                            
                    </Tabs>
                  </SheetContent>
            
    </Sheet>
  );
}
