'use client';

import { ComparisonContent, ComparisonItem } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface ComparisonEditorProps {
  data: ComparisonContent;
  onChange: (data: ComparisonContent) => void;
}

export function ComparisonEditor({ data, onChange }: ComparisonEditorProps) {
  const updateItem = (
    index: number,
    field: keyof ComparisonItem,
    value: string
  ) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { dimension: '', before: '', after: '' }],
    });
  };

  const removeItem = (index: number) => {
    onChange({
      ...data,
      items: data.items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4 pt-2">
      {data.items.map((item, idx) => (
        <div
          key={idx}
          className="bg-sage-50/20 border-sage-100/50 grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 rounded-lg border p-3"
        >
          <div className="space-y-1">
            <Label className="text-sage-600 text-[10px] font-bold tracking-wider uppercase">
              Dimension
            </Label>
            <Input
              value={item.dimension}
              onChange={(e) => updateItem(idx, 'dimension', e.target.value)}
              placeholder="e.g. Performance"
              className="h-8 bg-white/50 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sage-600 text-[10px] font-bold tracking-wider uppercase">
              Before
            </Label>
            <Input
              value={item.before}
              onChange={(e) => updateItem(idx, 'before', e.target.value)}
              placeholder="Old way..."
              className="h-8 bg-white/50 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sage-600 text-[10px] font-bold tracking-wider uppercase">
              After
            </Label>
            <Input
              value={item.after}
              onChange={(e) => updateItem(idx, 'after', e.target.value)}
              placeholder="New way..."
              className="h-8 bg-white/50 text-xs"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(idx)}
            className="text-destructive hover:bg-destructive/10 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addItem}
        className="border-sage-300 text-sage-700 hover:bg-sage-50 w-full border-dashed"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Comparison Row
      </Button>
      <div className="space-y-2 pt-2">
        <Label className="text-xs font-bold tracking-wider text-[#6B4F3A] uppercase">
          Summary Result
        </Label>
        <Input
          value={data.summary || ''}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="e.g. Result: X improved Y by..."
          className="border-[#d4a373]/30 bg-[#faedcd]/20 text-[#3D2B1F]"
        />
      </div>
    </div>
  );
}
