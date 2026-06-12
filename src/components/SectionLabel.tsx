import { forwardRef } from 'react';

interface SectionLabelProps {
  text: string;
  centered?: boolean;
}

const SectionLabel = forwardRef<HTMLDivElement, SectionLabelProps>(
  ({ text, centered = false }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 mb-6 ${centered ? 'justify-center' : ''}`}
      >
        {!centered && (
          <span className="block w-5 h-[1px] bg-electric-cyan" />
        )}
        <span className="text-electric-cyan text-[0.7rem] font-inter font-medium tracking-[0.15em] uppercase">
          {text}
        </span>
      </div>
    );
  }
);

SectionLabel.displayName = 'SectionLabel';
export default SectionLabel;
