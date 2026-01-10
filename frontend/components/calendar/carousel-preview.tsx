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
                "w-[500px] aspect-square rounded-2xl shadow-lg p-12 relative flex flex-col shrink-0 whitespace-normal transition-all hover:scale-[1.02]",
                slide.bg,
                slide.text
              )}
            >
              <div className="absolute top-6 right-8 bg-black/10 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider opacity-60">
                {slide.label}
              </div>
              
              {slide.type === 'title' && (
                <div className="flex-1 flex flex-col justify-center text-center space-y-8">
                  <h1 className="text-4xl font-extrabold leading-tight font-serif italic">
                    {slide.title}
                  </h1>
                  <p className="text-xl opacity-90 leading-relaxed font-medium">
                    {slide.hook}
                  </p>
                  <div className="pt-8 text-lg font-bold opacity-80">
                    {slide.author}
                  </div>
                </div>
              )}

              {slide.type === 'content' && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="h-1.5 w-full bg-[#d4a373]/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d4a373] w-1/3" />
                  </div>
                  <h2 className="text-3xl font-extrabold leading-tight font-serif">
                    {slide.header}
                  </h2>
                  <p className="text-lg leading-relaxed flex-1">
                    {slide.content}
                  </p>
                  {slide.example && (
                    <div className="bg-black/5 p-6 rounded-2xl border-l-4 border-[#d4a373] italic">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#d4a373] mb-2">Real Example</p>
                      <p className="text-sm opacity-90">{slide.example}</p>
                    </div>
                  )}
                </div>
              )}

              {slide.type === 'takeaways' && (
                <div className="flex-1 flex flex-col space-y-8">
                  <h2 className="text-4xl font-extrabold text-[#d4a373] text-center font-serif">
                    {slide.title}
                  </h2>
                  <div className="space-y-4 flex-1">
                    {slide.items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="text-2xl text-[#d4a373] font-bold">→</span>
                        <p className="text-lg leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                  {slide.cta && (
                    <div className="pt-6 border-t border-[#d4a373]/30 text-center">
                      <p className="text-xl font-bold text-[#faedcd] italic">
                        {slide.cta}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="absolute bottom-6 right-8 text-sm font-bold opacity-40">
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
