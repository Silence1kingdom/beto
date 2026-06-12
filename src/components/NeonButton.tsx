import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ variant = 'primary', children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative px-8 py-3.5 rounded-md text-[0.85rem] font-inter font-semibold tracking-[0.05em] uppercase transition-all duration-250',
          'active:scale-[0.98]',
          variant === 'primary' && [
            'gradient-cyan-purple text-void-black',
            'hover:scale-[1.04] hover:shadow-neon-lg',
          ],
          variant === 'ghost' && [
            'bg-transparent border border-electric-cyan text-electric-cyan',
            'hover:bg-electric-cyan/10',
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonButton.displayName = 'NeonButton';
export default NeonButton;
