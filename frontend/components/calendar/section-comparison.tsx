"use client";

import { ComparisonContent } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SectionComparisonProps {
  comparison: ComparisonContent;
}

export function SectionComparison({ comparison }: SectionComparisonProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-sage-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-sage-50/50">
            <TableRow>
              <TableHead className="w-[120px] font-serif font-bold text-sage-900">Dimension</TableHead>
              <TableHead className="font-serif font-bold text-sage-900">Traditional / Before</TableHead>
              <TableHead className="font-serif font-bold text-sage-900">Modern / After</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparison.items.map((item, index) => (
              <TableRow key={index} className="hover:bg-sage-50/30 transition-colors">
                <TableCell className="font-medium text-sage-700 bg-sage-50/20">{item.dimension}</TableCell>
                <TableCell className="text-muted-foreground">{item.before}</TableCell>
                <TableCell className="text-sage-900 font-medium">{item.after}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {comparison.summary && (
        <p className="text-sm italic text-sage-600 border-l-2 border-sage-300 pl-4 py-1 bg-sage-50/30 rounded-r-md">
          {comparison.summary}
        </p>
      )}
    </div>
  );
}
