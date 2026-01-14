import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        draft: 'bg-yellow-100/50 border-yellow-200 text-yellow-700',
        'in-progress': 'bg-blue-100/50 border-blue-200 text-blue-700',
        scheduled: 'bg-green-100/50 border-green-200 text-green-700',
        planned: 'bg-purple-100/50 border-purple-200 text-purple-700',
        researched: 'bg-indigo-100/50 border-indigo-200 text-indigo-700',
        proposed: 'bg-gray-100/50 border-gray-200 text-gray-700',
        selected: 'bg-pink-100/50 border-pink-200 text-pink-700',
        inDraft: 'bg-orange-100/50 border-orange-200 text-orange-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export const statusDotColors = {
  draft: 'bg-yellow-400',
  'in-progress': 'bg-blue-400',
  scheduled: 'bg-green-500',
  planned: 'bg-purple-400',
  researched: 'bg-indigo-500',
  proposed: 'bg-gray-400',
  selected: 'bg-pink-400',
  inDraft: 'bg-orange-400',
};

export { Badge, badgeVariants };
