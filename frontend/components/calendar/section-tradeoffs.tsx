"use client";

import { TradeoffsContent } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from "lucide-react";

interface SectionTradeoffsProps {
  tradeoffs: TradeoffsContent;
}

export function SectionTradeoffs({ tradeoffs }: SectionTradeoffsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros */}
        <Card className="bg-emerald-50/30 border-emerald-100 shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h4 className="font-serif font-bold text-emerald-900">Key Benefits</h4>
            </div>
            <ul className="space-y-2">
              {tradeoffs.pros.map((pro, i) => (
                <li key={i} className="text-sm text-emerald-800 flex gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cons */}
        <Card className="bg-rose-50/30 border-rose-100 shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-5 w-5 text-rose-600" />
              <h4 className="font-serif font-bold text-rose-900">Challenges</h4>
            </div>
            <ul className="space-y-2">
              {tradeoffs.cons.map((con, i) => (
                <li key={i} className="text-sm text-rose-800 flex gap-2">
                  <span className="text-rose-400 mt-1">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Constraints & Real World */}
      <div className="space-y-4">
        <div className="bg-amber-50/40 border border-amber-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">When NOT to use</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tradeoffs.constraints.map((constraint, i) => (
              <Badge key={i} variant="outline" className="bg-white/80 border-amber-200 text-amber-900 hover:bg-white">
                {constraint}
              </Badge>
            ))}
          </div>
        </div>

        {tradeoffs.real_world_context && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Real-World Context</span>
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
