"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';
import { useNewsroomStore, KanbanCard as KanbanCardType, KanbanStatus } from '@/lib/store';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function NewsroomBoard() {
  const { cards, fetchCards, isLoading, generateCycle } = useNewsroomStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragStartStatus, setDragStartStatus] = useState<KanbanStatus | null>(null);
  
  // Confirmation State
  const [showConfirm, setShowConfirm] = useState(false);
  
  // We store the original state to revert to if cancelled
  const [originalState, setOriginalState] = useState<KanbanCardType[] | null>(null);
  
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getCardById = (id: string) => cards.find(c => c.id === id);
  const activeCard = activeId ? getCardById(activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    const card = getCardById(event.active.id as string);
    if (card) {
        setActiveId(card.id);
        setDragStartStatus(card.status);
        // Snapshot current cards for rollback
        setOriginalState([...cards]);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeCard = getCardById(activeId);
    if (!activeCard) return;

    // Determine target status
    let overStatus: KanbanStatus;
    const overCard = getCardById(overId);
    
    if (overCard) {
        overStatus = overCard.status;
    } else {
        overStatus = overId as KanbanStatus;
    }

    // DISABLE DROPPING INTO SCHEDULED
    if (overStatus === 'scheduled') return;

    // Optimistically update state for visual feedback
    if (activeCard.status !== overStatus) {
         useNewsroomStore.setState((state) => {
            const activeIndex = state.cards.findIndex(c => c.id === activeId);
            const newCards = [...state.cards];
            newCards[activeIndex] = { ...newCards[activeIndex], status: overStatus };
            return { cards: newCards };
        });
    } else {
         useNewsroomStore.setState((state) => {
            const activeIndex = state.cards.findIndex(c => c.id === activeId);
            const overIndex = state.cards.findIndex(c => c.id === overId);
            if (activeIndex !== overIndex) {
                return {
                    cards: arrayMove(state.cards, activeIndex, overIndex),
                };
            }
            return state;
        });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeCard = getCardById(active.id as string);
    if (!activeCard) return;

    // If status changed from start, trigger confirmation
    if (dragStartStatus && activeCard.status !== dragStartStatus) {
        setShowConfirm(true);
    } else {
        // Clear snapshot if no change or same column sort
        setOriginalState(null);
    }
    
    setDragStartStatus(null);
  }

  const confirmMove = () => {
    setShowConfirm(false);
    setOriginalState(null);
  };

  const cancelMove = () => {
    setShowConfirm(false);
    if (originalState) {
        useNewsroomStore.setState({ cards: originalState });
    }
    setOriginalState(null);
  };

  const columns: { id: KanbanStatus; title: string }[] = [
    { 
        id: 'proposed', 
        title: 'Proposed Pool', 
    },
    { id: 'selected', title: 'Selected' },
    { id: 'inDraft', title: 'In Draft' },
    { id: 'scheduled', title: 'Scheduled' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full h-full min-h-0">
      <header className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Editorial Board
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={generateCycle}
            disabled={isLoading}
            className="rounded-full h-12 px-6 bg-secondary text-primary font-bold shadow-sm hover:bg-secondary/80 transition-transform hover:scale-105"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            {isLoading ? "Generating..." : "Generate Cycle (Next in 4h)"}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto pb-8 text-foreground">
        <div className="flex gap-12 h-full min-w-[1500px] w-full justify-between">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                cards={cards.filter((c) => c.status === col.id)}
              />
            ))}

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.5',
                        },
                    },
                }),
            }}>
              {activeCard ? <KanbanCard card={activeCard} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move Card?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of this card?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelMove}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMove}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
