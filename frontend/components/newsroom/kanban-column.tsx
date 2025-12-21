'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { KanbanCard as KanbanCardType, KanbanStatus } from '@/lib/store';
import { KanbanCard } from './kanban-card';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KanbanColumnProps {
  id: KanbanStatus;
  title: string;
  cards: KanbanCardType[];
}

export function KanbanColumn({ id, title, cards }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex h-full w-[340px] flex-shrink-0 flex-col gap-4">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground font-serif">{title}</h2>
            {id === 'proposed' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>3 new cards added every 4 hours. Approx. 18 per day.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <span className="text-sm font-bold text-muted-foreground bg-secondary/50 px-2.5 py-0.5 rounded-full">
            {cards.length}
          </span>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-4 rounded-2xl border-2 border-primary/10 bg-transparent p-4 transition-colors min-h-[500px]",
          "hover:bg-primary/[0.02]"
        )}
      >
        <SortableContext 
          id={id}
          items={cards.map(c => c.id)} 
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
