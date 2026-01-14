'use client';

import { ComparisonContent } from '@/lib/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SectionComparisonProps {
  comparison: ComparisonContent;
}

export function SectionComparison({ comparison }: SectionComparisonProps) {
  return (
    <div className="space-y-4">
      <div className="border-sage-200 overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-sage-50/50">
            <TableRow>
              <TableHead className="text-sage-900 w-[120px] font-serif font-bold">
                Dimension
              </TableHead>
              <TableHead className="text-sage-900 font-serif font-bold">
                Traditional / Before
              </TableHead>
              <TableHead className="text-sage-900 font-serif font-bold">
                Modern / After
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparison.items.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-sage-50/30 transition-colors"
              >
                <TableCell className="text-sage-700 bg-sage-50/20 font-medium">
                  {item.dimension}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.before}
                </TableCell>
                <TableCell className="text-sage-900 font-medium">
                  {item.after}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {comparison.summary && (
        <p className="text-sage-600 border-sage-300 bg-sage-50/30 rounded-r-md border-l-2 py-1 pl-4 text-sm italic">
          {comparison.summary}
        </p>
      )}
    </div>
  );
}
