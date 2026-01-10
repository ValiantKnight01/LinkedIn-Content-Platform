'use client';

import { Post } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
      text: 'text-[#fefae0]'
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
        bg: bgs[idx % bgs.length],
        text: 'text-[#3D2B1F]'
      };
    }),
    // Alternative Quote Style (if summary exists)
    ...(post.summary ? [{
      type: 'quote',
      label: 'Quote Style',
      text: post.summary.slice(0, 200) + (post.summary.length > 200 ? '...' : ''),
      source: 'Research Finding',
      bg: 'bg-[#3D2B1F]',
      textColor: 'text-[#fefae0]'
    }] : []),
    // Takeaways Slide
    {
      type: 'takeaways',
      label: 'Takeaways',
      title: 'Key Takeaways',
      items: post.key_takeaways || [],
      cta: post.call_to_action,
      bg: 'bg-[#3D2B1F]',
      text: 'text-[#fefae0]'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-black/5 p-8 overflow-hidden">
      <ScrollArea className="w-full h-full whitespace-nowrap rounded-xl shadow-2xl">
        <div className="flex w-max gap-8 p-4">
          {slides.map((slide, idx) => (
            <div 
              key={idx} 
              className={cn(
                "w-[500px] aspect-square rounded-2xl shadow-lg p-16 relative flex flex-col shrink-0 whitespace-normal transition-all hover:scale-[1.02]",
                slide.bg,
                slide.text
              )}
            >
              
              {slide.type === 'title' && (
                <div className="flex-1 flex flex-col justify-center text-center space-y-10">
                  <h1 className="text-5xl font-extrabold leading-tight font-serif italic">
                    {slide.title}
                  </h1>
                  <p className="text-2xl opacity-90 leading-relaxed font-medium">
                    {slide.hook}
                  </p>
                  <div className="absolute bottom-10 left-10 text-lg font-bold opacity-80">
                    {slide.author}
                  </div>
                </div>
              )}

              {slide.type === 'content' && (
                <div className="flex-1 flex flex-col space-y-8">
                  <div className="h-2 w-full bg-[#d4a373]/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d4a373] w-1/3" />
                  </div>
                  <h2 className="text-4xl font-extrabold leading-tight font-serif">
                    {slide.header}
                  </h2>
                  <p className="text-xl leading-relaxed flex-1">
                    {slide.content}
                  </p>
                  {slide.example && (
                    <div className="bg-black/5 p-8 rounded-3xl border-l-8 border-[#d4a373] italic">
                      <p className="text-sm font-bold uppercase tracking-widest text-[#d4a373] mb-3">Real Example</p>
                      <p className="text-lg opacity-90">{slide.example}</p>
                    </div>
                  )}
                </div>
              )}

              {slide.type === 'quote' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
                  <div className="text-9xl text-[#d4a373] opacity-30 font-serif h-16 leading-[0]">"</div>
                  <p className="text-3xl font-semibold leading-relaxed italic">
                    {slide.text}
                  </p>
                  <p className="text-[#d4a373] font-bold tracking-wider text-xl">
                    - {slide.source}
                  </p>
                </div>
              )}

              {slide.type === 'takeaways' && (
                <div className="flex-1 flex flex-col space-y-10">
                  <h2 className="text-5xl font-extrabold text-[#d4a373] text-center font-serif">
                    {slide.title}
                  </h2>
                  <div className="space-y-6 flex-1">
                    {slide.items.map((item, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <span className="text-3xl text-[#d4a373] font-bold">→</span>
                        <p className="text-xl leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                  {slide.cta && (
                    <div className="pt-8 border-t border-[#d4a373]/30 text-center">
                      <p className="text-2xl font-bold text-[#faedcd] italic">
                        {slide.cta}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="absolute bottom-10 right-10 text-base font-bold opacity-40">
                {idx + 1} / {slides.length}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <p className="text-center mt-6 text-sm text-muted-foreground font-medium animate-pulse">
        Scroll horizontally to preview your carousel →
      </p>
    </div>
  );
}
