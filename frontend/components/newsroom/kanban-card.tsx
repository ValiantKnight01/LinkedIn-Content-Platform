'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanCard as KanbanCardType } from '@/lib/store';
import { Link, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons = {
  link: Link,
  forum: MessageSquare,
  article: FileText,
};

export function KanbanCard({ card, isOverlay = false }: { card: KanbanCardType, isOverlay?: boolean }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group cursor-grab rounded-xl bg-card p-5 shadow-sm transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-lg active:cursor-grabbing",
        isDragging && "opacity-50 grayscale",
        isScheduled && "opacity-90 border-accent/30",
        isOverlay && "rotate-[-2deg] shadow-2xl cursor-grabbing scale-105 opacity-100 ring-2 ring-primary/20"
      )}
    >
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
    </div>
  );
}
