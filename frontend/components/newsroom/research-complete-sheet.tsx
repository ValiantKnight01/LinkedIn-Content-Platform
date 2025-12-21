"use client";

import React, { useState, useEffect } from 'react';
import { KanbanCard, useNewsroomStore } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, MessageSquare, FileText, Clock, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ResearchCompleteSheetProps {
  card: KanbanCard | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResearchCompleteSheet({ card, isOpen, onOpenChange }: ResearchCompleteSheetProps) {
  const { approveCard, discardCard, updateCardDetails } = useNewsroomStore();
  const [title, setTitle] = useState('');
  const [angle, setAngle] = useState('');
  
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setAngle(card.angle || '');
    }
  }, [card]);

  if (!card) return null;

  const handleApprove = async () => {
    // Save changes first/simultaneously
    await updateCardDetails(card.id, { title, angle });
    await approveCard(card.id);
    onOpenChange(false);
  };

  const handleDiscard = async () => {
    await discardCard(card.id);
    onOpenChange(false);
  };

  const availableAngles = card.angle_guidance ? Object.keys(card.angle_guidance) : ['Contrarian', 'Educational', 'Personal Story', 'Case Study', 'Trend Analysis'];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-[#FDF8F0] p-0 border-l border-[#3D2B1F]/10 flex flex-col">
        <SheetHeader className="sr-only">
          <SheetTitle>Research Complete: {card.title}</SheetTitle>
          <SheetDescription>Review and approve AI research.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="p-8 pb-6 border-b border-[#3D2B1F]/10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <Input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="!text-4xl !h-auto font-serif font-bold text-[#3D2B1F] bg-transparent border-none shadow-none p-0 focus-visible:ring-0 placeholder:text-[#3D2B1F]/50 leading-tight"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                         <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#faedcd] text-[#6B4F3A] text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            <span>{card.read_time || 'Est. 5 min read'}</span>
                        </div>
                        {card.source_url && (
                             <a href={card.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 hover:bg-white text-[#6B4F3A] text-sm font-medium transition-colors">
                                <ExternalLink className="w-4 h-4" />
                                <span>Source</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 pt-6 flex flex-col gap-8">
                
                {/* Why this matters */}
                <div className="flex flex-col gap-3">
                    <h3 className="font-serif text-xl font-bold text-[#3D2B1F]">Why this matters?</h3>
                    <p className="text-base leading-relaxed text-[#6B4F3A]">
                        {card.description || 'No description available.'}
                    </p>
                </div>

                {/* Proposed Angle - Editable */}
                <div className="flex flex-col gap-3">
                    <h3 className="font-serif text-xl font-bold text-[#3D2B1F]">Proposed Angle</h3>
                    <div className="flex flex-col gap-3">
                        <Select value={angle} onValueChange={setAngle}>
                            <SelectTrigger className="w-full p-4 h-auto rounded-xl bg-white border border-[#3D2B1F]/10 text-[#3D2B1F] text-lg font-medium focus:ring-2 focus:ring-[#d4a373]/50">
                                <SelectValue placeholder="Select an angle" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableAngles.map((a) => (
                                    <SelectItem key={a} value={a}>{a}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {/* Guidance Text */}
                        {angle && card.angle_guidance && card.angle_guidance[angle] && (
                             <p className="text-base leading-relaxed text-[#3D2B1F] italic bg-[#faedcd]/50 p-4 rounded-lg border border-[#d4a373]/20">
                                <span className="font-semibold not-italic text-[#3D2B1F]/70 mr-1">{angle}:</span> 
                                {card.angle_guidance[angle]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Key Data Points */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-serif text-xl font-bold text-[#3D2B1F]">Key Data Points</h3>
                    <ul className="flex flex-col gap-3 pl-2">
                        {card.data_points?.map((point, i) => (
                            <li key={i} className="flex gap-3 text-base text-[#6B4F3A] leading-relaxed">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#d4a373] shrink-0" />
                                {point}
                            </li>
                        )) || <li className="text-[#6B4F3A] italic">No data points available.</li>}
                    </ul>
                </div>

                 {/* Tags & Audience */}
                <div className="flex flex-wrap gap-2">
                     {card.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-lg bg-[#e9edc9] text-[#3D2B1F] text-sm font-medium">
                            #{tag}
                        </span>
                     ))}
                     {card.audience && (
                        <span className="px-3 py-1 rounded-lg bg-[#faedcd] text-[#3D2B1F] text-sm font-medium border border-[#d4a373]/30">
                            👤 {card.audience}
                        </span>
                     )}
                </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-8 pt-4 bg-[#FDF8F0] border-t border-[#3D2B1F]/10">
            <div className="flex gap-4">
                <Button 
                    onClick={handleApprove}
                    className="flex-1 h-14 text-lg font-semibold bg-[#A3B18A] hover:bg-[#8da36d] text-white rounded-xl shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    Approve & Draft
                </Button>
                <Button 
                    onClick={handleDiscard}
                    variant="ghost" 
                    className="flex-1 h-14 text-lg font-semibold text-[#6B4F3A] hover:bg-black/5 rounded-xl transition-colors"
                >
                    Discard Idea
                </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
