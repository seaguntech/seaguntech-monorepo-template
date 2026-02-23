import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    responsive: {
      none: '',
      sm: 'sm:grid-cols-2',
      md: 'sm:grid-cols-2 lg:grid-cols-3',
      lg: 'sm:grid-cols-2 lg:grid-cols-4',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 'md',
    responsive: 'none',
  },
});

export interface GridProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  ref?: React.Ref<HTMLDivElement>;
}

export function Grid({
  className,
  cols,
  gap,
  responsive,
  ref,
  ...props
}: GridProps) {
  return (
    <div
      data-slot="grid"
      ref={ref}
      className={cn(gridVariants({ cols, gap, responsive }), className)}
      {...props}
    />
  );
}

export { gridVariants };
