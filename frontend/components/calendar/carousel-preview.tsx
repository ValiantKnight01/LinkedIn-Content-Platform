'use client';

import { Post } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SectionComparison } from './section-comparison';
import { SectionTradeoffs } from './section-tradeoffs';

interface CarouselPreviewProps {
  post: Post;
}

export function CarouselPreview({ post }: CarouselPreviewProps) {
  const slides = [
    // Title Slide
    {
      type: 'title',
      label: 'Title Slide',
      title: post.title,
      hook: post.hook,
      author: 'Aditya Kulkarni', // This should ideally come from user profile
      bg: 'bg-[#d4a373]',
      text: 'text-[#fefae0]',
    },
    // Content Slides
    ...(post.sections || []).map((section, idx) => {
      const bgs = ['bg-[#fefae0]', 'bg-[#faedcd]', 'bg-[#e9edc9]'];
      return {
        type: 'content',
        label: 'Content',
        header: section.header,
        content: section.content,
        example: section.example_use_case,
        comparison: section.comparison,
        tradeoffs: section.tradeoffs,
        bg: bgs[idx % bgs.length],
        text: 'text-[#3D2B1F]',
      };
    }),
    // Alternative Quote Style (if summary exists)
    ...(post.summary
      ? [
          {
            type: 'quote',
            label: 'Quote Style',
            text:
              post.summary.slice(0, 200) +
              (post.summary.length > 200 ? '...' : ''),
            source: 'Research Finding',
            bg: 'bg-[#3D2B1F]',
            textColor: 'text-[#fefae0]',
          },
        ]
      : []),
    // Takeaways Slide
    {
      type: 'takeaways',
      label: 'Takeaways',
      title: 'Key Takeaways',
      items: post.key_takeaways || [],
      cta: post.call_to_action,
      bg: 'bg-[#3D2B1F]',
      text: 'text-[#fefae0]',
    },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-black/5 p-8">
      <ScrollArea className="h-full w-full rounded-xl whitespace-nowrap shadow-2xl">
        <div className="flex w-max gap-8 p-4">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={cn(
                'relative flex aspect-[16/10] w-[800px] shrink-0 flex-col rounded-3xl p-20 whitespace-normal shadow-2xl transition-all hover:scale-[1.01]',
                slide.bg,
                slide.text
              )}
            >
              {slide.type === 'title' && (
                <div className="flex flex-1 flex-col justify-center space-y-12 text-center">
                  <h1 className="font-serif text-6xl leading-tight font-extrabold italic">
                    {slide.title}
                  </h1>
                  <p className="mx-auto max-w-3xl text-3xl leading-relaxed font-medium opacity-90">
                    {slide.hook}
                  </p>
                  <div className="absolute bottom-12 left-12 text-xl font-bold opacity-80">
                    {slide.author}
                  </div>
                </div>
              )}

              {slide.type === 'content' && (
                <div className="flex flex-1 flex-col space-y-10">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#d4a373]/30">
                    <div className="h-full w-1/3 bg-[#d4a373]" />
                  </div>
                  <h2 className="font-serif text-5xl leading-tight font-extrabold">
                    {slide.header}
                  </h2>

                  <div className="flex-1 overflow-auto">
                    {slide.comparison ? (
                      <SectionComparison comparison={slide.comparison} />
                    ) : slide.tradeoffs ? (
                      <SectionTradeoffs tradeoffs={slide.tradeoffs} />
                    ) : (
                      <p className="text-2xl leading-relaxed">
                        {slide.content}
                      </p>
                    )}
                  </div>

                  {slide.example && (
                    <div className="mb-4 rounded-[2.5rem] border-l-[12px] border-[#d4a373] bg-black/5 p-10 italic">
                      <p className="mb-4 text-base font-bold tracking-widest text-[#d4a373] uppercase">
                        Real Example
                      </p>
                      <p className="text-xl opacity-90">{slide.example}</p>
                    </div>
                  )}
                </div>
              )}

              {slide.type === 'quote' && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-10 text-center">
                  <div className="h-24 font-serif text-[12rem] leading-[0] text-[#d4a373] opacity-30">
                    "
                  </div>
                  <p className="max-w-2xl text-4xl leading-relaxed font-semibold italic">
                    {slide.text}
                  </p>
                  <p className="text-2xl font-bold tracking-wider text-[#d4a373]">
                    - {slide.source}
                  </p>
                </div>
              )}

              {slide.type === 'takeaways' && (
                <div className="flex flex-1 flex-col space-y-12">
                  <h2 className="text-center font-serif text-6xl font-extrabold text-[#d4a373]">
                    {slide.title}
                  </h2>
                  <div className="flex-1 space-y-8">
                    {slide.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-8">
                        <span className="text-4xl font-bold text-[#d4a373]">
                          →
                        </span>
                        <p className="text-2xl leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                  {slide.cta && (
                    <div className="border-t border-[#d4a373]/30 pt-10 text-center">
                      <p className="text-3xl font-bold text-[#faedcd] italic">
                        {slide.cta}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="absolute right-12 bottom-12 text-xl font-bold opacity-40">
                {idx + 1} / {slides.length}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <p className="text-muted-foreground mt-6 animate-pulse text-center text-sm font-medium">
        Scroll horizontally to preview your carousel →
      </p>
    </div>
  );
}
