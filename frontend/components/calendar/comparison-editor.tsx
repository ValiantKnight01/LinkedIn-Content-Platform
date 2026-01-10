"use client";

import { ComparisonContent, ComparisonItem } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface ComparisonEditorProps {
  data: ComparisonContent;
  onChange: (data: ComparisonContent) => void;
}

export function ComparisonEditor({ data, onChange }: ComparisonEditorProps) {
  const updateItem = (index: number, field: keyof ComparisonItem, value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { dimension: "", before: "", after: "" }]
    });
  };

  const removeItem = (index: number) => {
    onChange({
      ...data,
      items: data.items.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4 pt-2">
      {data.items.map((item, idx) => (
        <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end bg-sage-50/20 p-3 rounded-lg border border-sage-100/50">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold text-sage-600 tracking-wider">Dimension</Label>
            <Input 
                value={item.dimension} 
                onChange={(e) => updateItem(idx, 'dimension', e.target.value)}
                placeholder="e.g. Performance"
                className="h-8 text-xs bg-white/50"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold text-sage-600 tracking-wider">Before</Label>
            <Input 
                value={item.before} 
                onChange={(e) => updateItem(idx, 'before', e.target.value)}
                placeholder="Old way..."
                className="h-8 text-xs bg-white/50"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold text-sage-600 tracking-wider">After</Label>
            <Input 
                value={item.after} 
                onChange={(e) => updateItem(idx, 'after', e.target.value)}
                placeholder="New way..."
                className="h-8 text-xs bg-white/50"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={addItem} 
        className="w-full border-dashed border-sage-300 text-sage-700 hover:bg-sage-50"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Comparison Row
      </Button>
      <div className="space-y-2 pt-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A]">Summary Result</Label>
        <Input 
            value={data.summary || ""} 
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            placeholder="e.g. Result: X improved Y by..."
            className="bg-[#faedcd]/20 border-[#d4a373]/30 text-[#3D2B1F]"
        />
      </div>
    </div>
  );
}
