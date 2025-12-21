'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanCard as KanbanCardType } from '@/lib/store';
import { Link, MessageSquare, FileText, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const typeIcons = {
  link: Link,
  forum: MessageSquare,
  article: FileText,
};

interface KanbanCardProps {
  card: KanbanCardType;
  isOverlay?: boolean;
  onClick?: (card: KanbanCardType) => void;
}

export function KanbanCard({ card, isOverlay = false, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const Icon = typeIcons[card.type];
  const isScheduled = card.status === 'scheduled';
  
  // Research Status Logic
  const isSelected = card.status === 'selected';
  const isResearchComplete = isSelected && card.research_status === 'complete';
  const isResearching = isSelected && card.research_status === 'researching';

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if research is complete and we are not dragging
    if (isResearchComplete && onClick && !isDragging) {
      onClick(card);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        "group cursor-grab rounded-xl bg-card p-5 shadow-sm transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-lg active:cursor-grabbing",
        isDragging && "opacity-50 grayscale",
        isScheduled && "opacity-90 border-accent/30",
        isResearchComplete && "cursor-pointer hover:ring-2 hover:ring-primary/50",
        isOverlay && "rotate-[-2deg] shadow-2xl cursor-grabbing scale-105 opacity-100 ring-2 ring-primary/20"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
            <p className="text-base font-bold text-foreground leading-tight">
            {card.title}
            </p>
            {isScheduled ? (
            <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
            ) : (
            <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
        </div>
        
        {/* Research Status Indicators */}
        {isSelected && (
            <div className="flex items-center gap-2">
                {isResearchComplete && (
                    <Badge variant="outline" className="bg-[#faedcd] text-[#6B4F3A] border-[#d4a373]/30 gap-1 pl-1.5 hover:bg-[#faedcd]">
                        <Sparkles className="w-3 h-3 text-[#d4a373]" />
                        Review Ready
                    </Badge>
                )}
                {isResearching && (
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border gap-1 pl-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Researching...
                    </Badge>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

