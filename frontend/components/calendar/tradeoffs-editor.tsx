'use client';

import { TradeoffsContent } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TradeoffsEditorProps {
  data: TradeoffsContent;
  onChange: (data: TradeoffsContent) => void;
}

export function TradeoffsEditor({ data, onChange }: TradeoffsEditorProps) {
  const updateList = (
    field: 'pros' | 'cons' | 'constraints',
    index: number,
    value: string
  ) => {
    const newList = [...data[field]];
    newList[index] = value;
    onChange({ ...data, [field]: newList });
  };

  const addToList = (field: 'pros' | 'cons' | 'constraints') => {
    onChange({ ...data, [field]: [...data[field], ''] });
  };

  const removeFromList = (
    field: 'pros' | 'cons' | 'constraints',
    index: number
  ) => {
    onChange({ ...data, [field]: data[field].filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="space-y-3">
        <Label className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">
          Pros / Benefits
        </Label>
        <div className="space-y-2">
          {data.pros.map((pro, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={pro}
                onChange={(e) => updateList('pros', idx, e.target.value)}
                className="h-9 border-emerald-100 bg-emerald-50/30 focus:border-emerald-300 focus:ring-emerald-200/20"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromList('pros', idx)}
                className="h-9 w-9 shrink-0 text-rose-500 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToList('pros')}
          className="w-full border-dashed border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Pro
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-[10px] font-bold tracking-widest text-rose-700 uppercase">
          Cons / Challenges
        </Label>
        <div className="space-y-2">
          {data.cons.map((con, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={con}
                onChange={(e) => updateList('cons', idx, e.target.value)}
                className="h-9 border-rose-100 bg-rose-50/30 focus:border-rose-300 focus:ring-rose-200/20"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromList('cons', idx)}
                className="h-9 w-9 shrink-0 text-rose-500 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToList('cons')}
          className="w-full border-dashed border-rose-200 text-rose-700 hover:bg-rose-50"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Con
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">
          When NOT to use
        </Label>
        <div className="space-y-2">
          {data.constraints.map((c, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={c}
                onChange={(e) => updateList('constraints', idx, e.target.value)}
                className="h-9 border-amber-100 bg-amber-50/30 focus:border-amber-300 focus:ring-amber-200/20"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromList('constraints', idx)}
                className="h-9 w-9 shrink-0 text-rose-500 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToList('constraints')}
          className="w-full border-dashed border-amber-200 text-amber-700 hover:bg-amber-50"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Constraint
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold tracking-wider text-[#6B4F3A] uppercase">
          Real-World Context
        </Label>
        <Textarea
          value={data.real_world_context || ''}
          onChange={(e) =>
            onChange({ ...data, real_world_context: e.target.value })
          }
          placeholder="A specific example of issues or failures..."
          className="rounded-xl border-slate-200 bg-slate-50 focus:border-slate-400 focus:ring-slate-300/20"
        />
      </div>
    </div>
  );
}
