import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    },
    gutter: {
      none: 'px-0',
      sm: 'px-4 sm:px-6',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-10',
    },
  },
  defaultVariants: {
    size: 'xl',
    gutter: 'md',
  },
});

export interface ContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  ref?: React.Ref<HTMLDivElement>;
}

export function Container({
  className,
  size,
  gutter,
  ref,
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      ref={ref}
      className={cn(containerVariants({ size, gutter }), className)}
      {...props}
    />
  );
}

export { containerVariants };
