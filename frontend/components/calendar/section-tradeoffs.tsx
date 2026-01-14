'use client';

import { TradeoffsContent } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface SectionTradeoffsProps {
  tradeoffs: TradeoffsContent;
}

export function SectionTradeoffs({ tradeoffs }: SectionTradeoffsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Pros */}
        <Card className="border-emerald-100 bg-emerald-50/30 shadow-none">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h4 className="font-serif font-bold text-emerald-900">
                Key Benefits
              </h4>
            </div>
            <ul className="space-y-2">
              {tradeoffs.pros.map((pro, i) => (
                <li key={i} className="flex gap-2 text-sm text-emerald-800">
                  <span className="mt-1 text-emerald-400">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cons */}
        <Card className="border-rose-100 bg-rose-50/30 shadow-none">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-600" />
              <h4 className="font-serif font-bold text-rose-900">Challenges</h4>
            </div>
            <ul className="space-y-2">
              {tradeoffs.cons.map((con, i) => (
                <li key={i} className="flex gap-2 text-sm text-rose-800">
                  <span className="mt-1 text-rose-400">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Constraints & Real World */}
      <div className="space-y-4">
        <div className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-bold tracking-wider text-amber-800 uppercase">
              When NOT to use
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tradeoffs.constraints.map((constraint, i) => (
              <Badge
                key={i}
                variant="outline"
                className="border-amber-200 bg-white/80 text-amber-900 hover:bg-white"
              >
                {constraint}
              </Badge>
            ))}
          </div>
        </div>

        {tradeoffs.real_world_context && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                Real-World Context
              </span>
            </div>
            <p className="text-sm text-slate-600 italic">
              "{tradeoffs.real_world_context}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
