'use client';

import { useState } from 'react';
import { useSyllabusStore, Theme } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import dayjs from 'dayjs';

interface AddThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: Theme; // Existing theme for editing
}

export function AddThemeDialog({
  open,
  onOpenChange,
  theme,
}: AddThemeDialogProps) {
  const { addTheme, updateTheme } = useSyllabusStore();
  const [title, setTitle] = useState(theme?.title || '');
  const [description, setDescription] = useState(theme?.description || '');
  const [category, setCategory] = useState(theme?.category || '');
  const [month, setMonth] = useState(theme?.month || dayjs().month() + 1);
  const [year, setYear] = useState(theme?.year || dayjs().year());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (theme) {
      await updateTheme(theme.id, {
        title,
        description,
        category,
        month,
        year,
      });
    } else {
      await addTheme({
        title,
        description,
        category,
        month,
        year,
      });
    }

    onOpenChange(false);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: dayjs().month(i).format('MMMM'),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-primary/20 overflow-hidden rounded-[2rem] bg-[#fefae0] shadow-xl sm:max-w-[500px]">
        <DialogHeader className="p-2">
          <DialogTitle className="pt-4 text-center font-serif text-3xl text-[#3D2B1F]">
            {theme ? 'Edit Theme' : 'Add Monthly Theme'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Title
            </label>
            <Input
              placeholder="e.g., RAG Architectures"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-primary/20 focus:border-primary rounded-xl transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">
                Month
              </label>
              <Select
                value={month.toString()}
                onValueChange={(v) => setMonth(parseInt(v))}
              >
                <SelectTrigger className="border-primary/20 rounded-xl">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value.toString()}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">
                Year
              </label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="border-primary/20 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Category (Optional)
            </label>
            <Input
              placeholder="e.g., Advanced AI"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-primary/20 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Description
            </label>
            <Textarea
              placeholder="Brief overview of the theme focus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-primary/20 min-h-[100px] rounded-xl"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
            >
              {theme ? 'Update Theme' : 'Save Theme'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
