import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const stackVariants = cva('flex flex-col', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

export interface StackProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  ref?: React.Ref<HTMLDivElement>;
}

export function Stack({
  className,
  gap,
  align,
  justify,
  ref,
  ...props
}: StackProps) {
  return (
    <div
      data-slot="stack"
      ref={ref}
      className={cn(stackVariants({ gap, align, justify }), className)}
      {...props}
    />
  );
}

export { stackVariants };
