'use client';

import { Post, PostStatus } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, FileText, Globe, Save, Trash2, Plus, Copy, Check, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CarouselPreview } from './carousel-preview';
import { ComparisonEditor } from './comparison-editor';
import { TradeoffsEditor } from './tradeoffs-editor';
import { SectionComparison } from './section-comparison';
import { SectionTradeoffs } from './section-tradeoffs';

export function PostEditorSheet({
  post,
  editData,
  setEditData,
  isResearching,
  isSaving,
  isDownloading,
  copied,
  handleResearch,
  handleSave,
  handleDownloadPDF,
  handleCopy,
}: PostEditorSheetProps) {
  return (
    <SheetContent
      className="border-primary/20 w-full gap-0 overflow-hidden border-l bg-[#fefae0] p-0 sm:max-w-[50vw]"
      side="right"
    >
      <Tabs defaultValue="research" className="flex h-full w-full flex-col">
        <div className="border-primary/10 flex shrink-0 items-center justify-between gap-4 border-b bg-[#fefae0] px-8 pt-6 pb-2">
          <TabsList className="grid w-full max-w-md grid-cols-4 rounded-full bg-[#faedcd] p-1">
            <TabsTrigger
              value="research"
              className="rounded-full data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-[#fefae0] data-[state=active]:shadow-sm"
            >
              Research
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="rounded-full data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-[#fefae0] data-[state=active]:shadow-sm"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="rounded-full data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-[#fefae0] data-[state=active]:shadow-sm"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="export"
              className="rounded-full data-[state=active]:bg-[#3D2B1F] data-[state=active]:text-[#fefae0] data-[state=active]:shadow-sm"
            >
              Export
            </TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-9 shrink-0 rounded-full border-[#d4a373] px-4 font-medium text-[#3D2B1F] hover:bg-[#d4a373]/20"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-700" /> Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy Post
              </>
            )}
          </Button>
        </div>

        <TabsContent
          value="research"
          className="m-0 flex flex-1 flex-col overflow-hidden border-none bg-[#fefae0]"
        >
          <div className="flex h-full w-full flex-col">
            <SheetHeader className="shrink-0 space-y-4 p-8 pb-4 text-left">
              <div className="flex items-center gap-3">
                <Badge
                  variant={post.status as any}
                  className="px-3 py-1 capitalize"
                >
                  {post.status}
                </Badge>
                {post.difficulty && (
                  <Badge
                    variant="outline"
                    className="border-primary/20 text-foreground/60 px-3 py-1"
                  >
                    {post.difficulty}
                  </Badge>
                )}
              </div>
              <SheetTitle className="font-serif text-3xl leading-tight font-bold text-[#3D2B1F]">
                {post.title}
              </SheetTitle>
              <SheetDescription className="text-base leading-relaxed text-[#6B4F3A]">
                {post.learning_objective || 'No learning objective defined.'}
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="min-h-0 w-full flex-1">
              <div className="px-8 pb-8">
                {/* Research Results */}
                {post.status === 'researched' &&
                (post.summary || post.hook) ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
                    <div className="space-y-6">
                      <h4 className="flex items-center gap-2 text-lg font-bold text-[#3D2B1F]">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        Research Synthesis
                      </h4>

                      {/* New Structured Fields */}
                      {post.hook && (
                        <div className="space-y-2">
                          <p className="text-xl leading-relaxed font-medium text-[#3D2B1F] italic">
                            "{post.hook}"
                          </p>
                        </div>
                      )}

                      {post.sections && post.sections.length > 0 && (
                        <div className="space-y-8 py-4">
                          {post.sections.map((section, idx) => (
                            <div
                              key={idx}
                              className="border-primary/5 space-y-4 rounded-[2rem] border bg-white/40 p-6 shadow-sm"
                            >
                              <h5 className="font-serif text-xl font-bold text-[#3D2B1F]">
                                {section.header}
                              </h5>

                              {section.comparison ? (
                                <SectionComparison
                                  comparison={section.comparison}
                                />
                              ) : section.tradeoffs ? (
                                <SectionTradeoffs
                                  tradeoffs={section.tradeoffs}
                                />
                              ) : (
                                <p className="text-lg leading-relaxed text-[#4A3728]">
                                  {section.content}
                                </p>
                              )}

                              {section.example_use_case && (
                                <p className="rounded-xl bg-black/5 p-3 text-sm text-[#6B4F3A] italic">
                                  Example: {section.example_use_case}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {post.key_takeaways &&
                        post.key_takeaways.length > 0 && (
                          <div className="space-y-3 rounded-[2rem] border border-indigo-100 bg-indigo-50/50 p-6">
                            <p className="mb-2 text-sm font-bold tracking-widest text-indigo-900 uppercase">
                              Key Takeaways
                            </p>
                            <ul className="space-y-2">
                              {post.key_takeaways.map((point, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-lg leading-relaxed text-[#4A3728]"
                                >
                                  <span className="mt-1 shrink-0 text-indigo-500">
                                    •
                                  </span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {post.call_to_action && (
                        <div className="bg-primary/5 border-primary/10 rounded-[2rem] border p-6">
                          <p className="text-center font-serif text-xl font-medium text-[#3D2B1F]">
                            {post.call_to_action}
                          </p>
                        </div>
                      )}

                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {post.hashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-sm font-medium text-indigo-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Legacy Summary Fallback */}
                      {!post.hook && post.summary && (
                        <div className="prose prose-sm max-w-none leading-relaxed text-[#4A3728]">
                          {post.summary.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-4 text-lg last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {post.sources && post.sources.length > 0 && (
                      <div className="border-primary/10 space-y-4 border-t pt-4">
                        <h4 className="text-foreground/60 flex items-center gap-2 pl-1 text-sm font-bold tracking-widest uppercase">
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
                              className="text-primary hover:border-primary/5 block truncate rounded-2xl border border-transparent bg-black/5 p-4 text-xs underline-offset-4 transition-all hover:bg-black/10 hover:underline"
                            >
                              {source}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-primary/10 bg-primary/5 flex flex-col items-center justify-center space-y-6 rounded-[2.5rem] border-2 border-dashed py-24 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 shadow-sm">
                      <FileText className="text-primary/40 h-10 w-10" />
                    </div>
                    <div className="mx-auto max-w-xs space-y-2">
                      <p className="font-serif text-2xl font-medium text-[#3D2B1F]">
                        Ready to Research
                      </p>
                      <p className="text-sm leading-relaxed text-[#6B4F3A]">
                        Generate a detailed summary and collect authoritative
                        sources for this topic.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <SheetFooter className="border-primary/10 shrink-0 border-t bg-inherit p-8 pt-4">
              {post.status !== 'researched' ||
              (!post.summary && !post.hook) ? (
                <Button
                  onClick={handleResearch}
                  disabled={isResearching}
                  className="h-14 w-full rounded-full bg-[#3D2B1F] text-lg font-medium text-[#fefae0] shadow-lg transition-all hover:bg-[#2a1e16] hover:shadow-xl"
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
                <div className="text-muted-foreground flex w-full items-center justify-between px-2 text-sm">
                  <span className="font-medium">Research Complete</span>
                  <span className="opacity-50">Drafting module locked</span>
                </div>
              )}
            </SheetFooter>
          </div>
        </TabsContent>

        <TabsContent
          value="edit"
          className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden border-none bg-[#fefae0]"
        >
          <ScrollArea className="h-full flex-1">
            <div className="space-y-8 p-8">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-xs font-bold tracking-wider text-[#3D2B1F] uppercase"
                  >
                    Post Title
                  </Label>
                  <Input
                    id="title"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="h-11 rounded-xl border-[#d4a373]/40 bg-[#faedcd]/30 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="hook"
                    className="text-xs font-bold tracking-wider text-[#3D2B1F] uppercase"
                  >
                    Hook (First Line)
                  </Label>
                  <Textarea
                    id="hook"
                    value={editData.hook || ''}
                    onChange={(e) =>
                      setEditData({ ...editData, hook: e.target.value })
                    }
                    className="min-h-[100px] rounded-xl border-[#d4a373]/40 bg-[#faedcd]/30 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
                    placeholder="Enter a thumb-stopping hook..."
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="learning_objective"
                    className="text-xs font-bold tracking-wider text-[#3D2B1F] uppercase"
                  >
                    Learning Objective
                  </Label>
                  <Textarea
                    id="learning_objective"
                    value={editData.learning_objective || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        learning_objective: e.target.value,
                      })
                    }
                    className="rounded-xl border-[#d4a373]/40 bg-[#faedcd]/30 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="status"
                      className="text-xs font-bold tracking-wider text-[#3D2B1F] uppercase"
                    >
                      Status
                    </Label>
                    <select
                      id="status"
                      value={editData.status}
                      disabled
                      className="h-11 w-full cursor-not-allowed rounded-xl border border-[#d4a373]/20 bg-black/5 px-3 font-medium text-[#3D2B1F]/60"
                    >
                      <option value="planned">Planned</option>
                      <option value="researched">Researched</option>
                      <option value="inDraft">In Draft</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="difficulty"
                      className="text-xs font-bold tracking-wider text-[#3D2B1F] uppercase"
                    >
                      Difficulty
                    </Label>
                    <Input
                      id="difficulty"
                      value={editData.difficulty || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          difficulty: e.target.value,
                        })
                      }
                      className="h-11 rounded-xl border-[#d4a373]/40 bg-[#faedcd]/30 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="cta"
                    className="text-xs font-bold tracking-wider text-[#3D2B1F] uppercase"
                  >
                    Call to Action
                  </Label>

                  <Input
                    id="cta"
                    value={editData.call_to_action || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        call_to_action: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl border-[#d4a373]/40 bg-[#faedcd]/30 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
                    placeholder="What should they do next?"
                  />
                </div>

                {/* Dynamic Sections */}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold text-[#3D2B1F]">
                      Carousel Sections
                    </Label>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditData({
                          ...editData,

                          sections: [
                            ...(editData.sections || []),
                            { header: '', content: '', example_use_case: '' },
                          ],
                        })
                      }
                      className="rounded-full border-[#d4a373]/30 text-[#3D2B1F] hover:bg-[#d4a373]/10"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Section
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {editData.sections?.map((section, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-[1.5rem] border border-[#d4a373]/20 bg-white/40 p-6"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setEditData({
                              ...editData,

                              sections: editData.sections?.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="text-destructive absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold tracking-wider text-[#6B4F3A] uppercase">
                              Slide Header
                            </Label>

                            <Input
                              value={section.header || ''}
                              onChange={(e) => {
                                const newSections = [
                                  ...(editData.sections || []),
                                ];

                                newSections[idx].header = e.target.value;

                                setEditData({
                                  ...editData,
                                  sections: newSections,
                                });
                              }}
                              className="h-10 rounded-xl border-[#d4a373]/30 bg-[#faedcd]/20 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
                              placeholder="Slide heading..."
                            />
                          </div>

                          {section.comparison ? (
                            <ComparisonEditor
                              data={section.comparison}
                              onChange={(newData) => {
                                const newSections = [
                                  ...(editData.sections || []),
                                ];

                                newSections[idx].comparison = newData;

                                setEditData({
                                  ...editData,
                                  sections: newSections,
                                });
                              }}
                            />
                          ) : section.tradeoffs ? (
                            <TradeoffsEditor
                              data={section.tradeoffs}
                              onChange={(newData) => {
                                const newSections = [
                                  ...(editData.sections || []),
                                ];

                                newSections[idx].tradeoffs = newData;

                                setEditData({
                                  ...editData,
                                  sections: newSections,
                                });
                              }}
                            />
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-xs font-bold tracking-wider text-[#6B4F3A] uppercase">
                                Slide Content
                              </Label>

                              <Textarea
                                value={section.content || ''}
                                onChange={(e) => {
                                  const newSections = [
                                    ...(editData.sections || []),
                                  ];

                                  newSections[idx].content = e.target.value;

                                  setEditData({
                                    ...editData,
                                    sections: newSections,
                                  });
                                }}
                                className="min-h-[80px] rounded-xl border-[#d4a373]/30 bg-[#faedcd]/20 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
                                placeholder="What's the core message?"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label className="text-xs font-bold tracking-wider text-[#6B4F3A] uppercase">
                              Example (Optional)
                            </Label>

                            <Input
                              value={section.example_use_case || ''}
                              onChange={(e) => {
                                const newSections = [
                                  ...(editData.sections || []),
                                ];

                                newSections[idx].example_use_case =
                                  e.target.value;

                                setEditData({
                                  ...editData,
                                  sections: newSections,
                                });
                              }}
                              className="h-10 rounded-xl border-[#d4a373]/30 bg-[#faedcd]/20 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
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
                    <Label className="font-bold text-[#3D2B1F]">
                      Key Takeaways
                    </Label>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditData({
                          ...editData,

                          key_takeaways: [
                            ...(editData.key_takeaways || []),
                            '',
                          ],
                        })
                      }
                      className="rounded-full border-[#d4a373]/30 text-[#3D2B1F] hover:bg-[#d4a373]/10"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Takeaway
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {editData.key_takeaways?.map((point, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={point || ''}
                          onChange={(e) => {
                            const newPoints = [
                              ...(editData.key_takeaways || []),
                            ];

                            newPoints[idx] = e.target.value;

                            setEditData({
                              ...editData,
                              key_takeaways: newPoints,
                            });
                          }}
                          className="h-10 rounded-xl border-[#d4a373]/30 bg-[#faedcd]/20 text-[#3D2B1F] transition-all focus:border-[#d4a373] focus:ring-[#d4a373]/20"
                          placeholder="A key point to remember..."
                        />

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setEditData({
                              ...editData,

                              key_takeaways: editData.key_takeaways?.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="text-destructive hover:bg-destructive/10 h-10 w-10 shrink-0 rounded-full"
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
          <div className="border-primary/10 shrink-0 border-t bg-[#fefae0] p-8 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-14 w-full rounded-full bg-[#3D2B1F] text-lg font-medium text-[#fefae0] shadow-lg transition-all hover:bg-[#2a1e16] hover:shadow-xl"
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
        <TabsContent
          value="preview"
          className="m-0 flex-1 overflow-hidden border-none p-0"
        >
          <CarouselPreview post={editData} />
        </TabsContent>

        <TabsContent
          value="export"
          className="m-0 flex flex-1 items-center justify-center overflow-hidden border-none bg-[#fefae0] p-0"
        >
          <div className="w-full max-w-md space-y-6 p-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#faedcd] shadow-sm">
              <FileText className="h-12 w-12 text-[#d4a373]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#3D2B1F]">
                Export Carousel
              </h3>
              <p className="text-lg text-[#6B4F3A]">
                Download your high-fidelity PDF carousel, ready for LinkedIn.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#d4a373]/20 bg-white/50 p-6 text-left">
              <div className="flex items-center gap-3 text-[#3D2B1F]">
                <Check className="h-5 w-5 text-green-600" />
                <span>Correct Aspect Ratio (1:1)</span>
              </div>
              <div className="flex items-center gap-3 text-[#3D2B1F]">
                <Check className="h-5 w-5 text-green-600" />
                <span>Vector-quality Text</span>
              </div>
              <div className="flex items-center gap-3 text-[#3D2B1F]">
                <Check className="h-5 w-5 text-green-600" />
                <span>Optimized File Size</span>
              </div>
            </div>

            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="h-14 w-full rounded-full bg-[#3D2B1F] text-lg font-medium text-[#fefae0] shadow-lg transition-all hover:bg-[#2a1e16] hover:shadow-xl"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-6 w-6" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </SheetContent>
  );
}