'use client';

import { useEffect, useState } from "react";
import { useSyllabusStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ThemeCard } from "@/components/syllabus/theme-card";
import { AddThemeDialog } from "@/components/syllabus/add-theme-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MonthlyThemesPage() {
  const { themes, fetchThemes, isLoading } = useSyllabusStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  // Sort themes by year and then month
  const sortedThemes = [...themes].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  return (
    <div className="flex flex-col h-full bg-[#fefae0]">
      <header className="flex items-center justify-between p-12 pb-8">
        <h1 className="font-serif text-4xl font-bold text-[#3D2B1F]">Monthly Syllabus</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-[1.25rem] bg-[#d4a373] hover:bg-[#c29262] text-white px-8 py-7 text-lg font-medium shadow-sm transition-transform hover:scale-105"
        >
          Add Theme
        </Button>
      </header>

      <ScrollArea className="flex-1 px-12 pb-12">
        <div className="w-full space-y-8">
          {isLoading ? (
            <div className="space-y-6 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 w-full rounded-[2.5rem] bg-[#faedcd]/20 animate-pulse" />
              ))}
            </div>
          ) : sortedThemes.length > 0 ? (
            <div className="flex flex-col gap-6 w-full">
              {sortedThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#d4a373]/30 rounded-[2.5rem] bg-[#faedcd]/10 w-full">
              <p className="text-[#6B4F3A] font-serif text-2xl mb-6 text-center px-6">
                No monthly themes assigned yet.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(true)}
                className="rounded-full border-[#d4a373] text-[#d4a373] hover:bg-[#d4a373] hover:text-white px-8"
              >
                Assign Educational Theme...
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <AddThemeDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
}