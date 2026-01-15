'use client';

import { Theme, useSyllabusStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Sparkles } from 'lucide-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { AddThemeDialog } from './add-theme-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface ThemeCardProps {
  theme: Theme;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const { deleteTheme, planTheme } = useSyllabusStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);

  const monthName = dayjs()
    .month(theme.month - 1)
    .format('MMMM');

  const handlePlan = async () => {
    setIsPlanning(true);
    await planTheme(theme.id);
    setIsPlanning(false);
  };

  return (
    <>
      <div className="group relative w-full rounded-[2.5rem] bg-[#faedcd]/40 p-10 transition-all duration-300 hover:bg-[#faedcd]/60">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-serif text-2xl font-bold text-[#d4a373]">
            {monthName}
          </h3>
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 h-8 w-8 rounded-full"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="text-muted-foreground h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-primary/20 rounded-3xl bg-[#fefae0]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-serif text-xl">
                    Delete Theme?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the theme for {monthName}{' '}
                    {theme.year}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                    onClick={() => deleteTheme(theme.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-sans text-xl font-bold text-[#3D2B1F]">
            {theme.title}
          </p>
          {theme.description && (
            <p className="font-sans text-base leading-relaxed text-[#6B4F3A]">
              {theme.description}
            </p>
          )}
        </div>

        <div className="absolute right-10 bottom-4 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-[#d4a373] text-[#d4a373] transition-colors hover:bg-[#d4a373] hover:text-white"
            onClick={handlePlan}
            disabled={isPlanning}
          >
            {isPlanning ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Planning...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-3 w-3" />
                Plan Curriculum
              </>
            )}
          </Button>
          <p className="text-muted-foreground/40 font-sans text-xs tracking-widest uppercase">
            {theme.year}
          </p>
        </div>
      </div>

      <AddThemeDialog
        key={isEditDialogOpen ? theme.id : 'closed'}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        theme={theme}
      />
    </>
  );
}
