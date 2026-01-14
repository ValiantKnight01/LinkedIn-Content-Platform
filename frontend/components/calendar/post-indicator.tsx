'use client';

import { Post } from '@/lib/store';

import { cn } from '@/lib/utils';

import { Sheet, SheetTrigger } from '@/components/ui/sheet';

import { usePostEditor } from '@/hooks/use-post-editor';

import { PostEditorSheet } from './post-editor-sheet';

import { Badge, statusDotColors } from '@/components/ui/badge';



export function PostIndicator({ post }: { post: Post }) {

  const editor = usePostEditor(post);



  return (

    <Sheet open={editor.isOpen} onOpenChange={editor.setIsOpen}>

      <SheetTrigger asChild>

        <Badge

          variant={post.status as any}

          className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 transition-all hover:opacity-80"

        >

          <div

            className={cn(

              'h-2 w-2 shrink-0 rounded-full',

              statusDotColors[post.status as keyof typeof statusDotColors]

            )}

          />

          <span className="text-foreground/80 truncate text-[11px] font-semibold">

            {post.title}

          </span>

        </Badge>

      </SheetTrigger>



      <PostEditorSheet {...editor} post={post} />

    </Sheet>

  );

}
