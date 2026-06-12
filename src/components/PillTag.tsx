import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PillTagProps {
  text: string;
  className?: string;
}

const PillTag = forwardRef<HTMLSpanElement, PillTagProps>(
  ({ text, className }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-block px-3 py-1 rounded-full text-[0.7rem] font-mono-terminal',
          'bg-electric-cyan/8 border border-electric-cyan/20 text-electric-cyan/70',
          className
        )}
      >
        {text}
      </span>
    );
  }
);

PillTag.displayName = 'PillTag';
export default PillTag;
