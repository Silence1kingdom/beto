import { forwardRef } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialIconButtonProps {
  platform: 'github' | 'linkedin';
  href?: string;
  className?: string;
}

const SocialIconButton = forwardRef<HTMLAnchorElement, SocialIconButtonProps>(
  ({ platform, href = '#', className }, ref) => {
    const Icon = platform === 'github' ? Github : Linkedin;

    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'w-9 h-9 rounded-full border border-white/20 flex items-center justify-center',
          'text-white/60 transition-all duration-250',
          'hover:border-electric-cyan hover:text-electric-cyan hover:shadow-neon-sm',
          className
        )}
      >
        <Icon size={16} />
      </a>
    );
  }
);

SocialIconButton.displayName = 'SocialIconButton';
export default SocialIconButton;
