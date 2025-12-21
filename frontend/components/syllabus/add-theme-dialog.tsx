'use client';

import { useState, useEffect } from "react";
import { useSyllabusStore, Theme } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";

interface AddThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: Theme; // Existing theme for editing
}

export function AddThemeDialog({ open, onOpenChange, theme }: AddThemeDialogProps) {
  const { addTheme, updateTheme } = useSyllabusStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());

  useEffect(() => {
    if (theme && open) {
      setTitle(theme.title);
      setDescription(theme.description || "");
      setCategory(theme.category || "");
      setMonth(theme.month);
      setYear(theme.year);
    } else if (!theme && open) {
      setTitle("");
      setDescription("");
      setCategory("");
      setMonth(dayjs().month() + 1);
      setYear(dayjs().year());
    }
  }, [theme, open]);

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
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] bg-[#fefae0] border-primary/20 shadow-xl overflow-hidden">
        <DialogHeader className="p-2">
          <DialogTitle className="font-serif text-3xl text-[#3D2B1F] text-center pt-4">
            {theme ? "Edit Theme" : "Add Monthly Theme"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Title</label>
            <Input
              placeholder="e.g., RAG Architectures"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Month</label>
              <Select 
                value={month.toString()} 
                onValueChange={(v) => setMonth(parseInt(v))}
              >
                <SelectTrigger className="rounded-xl border-primary/20">
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
              <label className="text-sm font-medium text-muted-foreground">Year</label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="rounded-xl border-primary/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category (Optional)</label>
            <Input
              placeholder="e.g., Advanced AI"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <Textarea
              placeholder="Brief overview of the theme focus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-primary/20 min-h-[100px]"
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
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              {theme ? "Update Theme" : "Save Theme"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
