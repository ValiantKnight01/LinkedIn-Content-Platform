'use client';

import { useEffect, useState } from 'react';
import { useSyllabusStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ThemeCard } from '@/components/syllabus/theme-card';
import { AddThemeDialog } from '@/components/syllabus/add-theme-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="flex h-full flex-col bg-[#fefae0]">
      <header className="flex items-center justify-between p-12 pb-8">
        <h1 className="font-serif text-4xl font-bold text-[#3D2B1F]">
          Monthly Syllabus
        </h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-[1.25rem] bg-[#d4a373] px-8 py-7 text-lg font-medium text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#c29262]"
        >
          Add Theme
        </Button>
      </header>

      <ScrollArea className="flex-1 px-12 pb-12">
        <div className="w-full space-y-8">
          {isLoading ? (
            <div className="w-full space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 w-full animate-pulse rounded-[2.5rem] bg-[#faedcd]/20"
                />
              ))}
            </div>
          ) : sortedThemes.length > 0 ? (
            <div className="flex w-full flex-col gap-6">
              {sortedThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-[#d4a373]/30 bg-[#faedcd]/10 py-32">
              <p className="mb-6 px-6 text-center font-serif text-2xl text-[#6B4F3A]">
                No monthly themes assigned yet.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
                className="rounded-full border-[#d4a373] px-8 text-[#d4a373] hover:bg-[#d4a373] hover:text-white"
              >
                Assign Educational Theme...
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <AddThemeDialog
        key={isDialogOpen ? 'open' : 'closed'}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
