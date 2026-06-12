import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const { t } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    gsap.fromTo(
      footer,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'expo.out', scrollTrigger: { trigger: footer, start: 'top 95%' } }
    );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="relative z-20 border-t border-electric-cyan/8 opacity-0">
      <div className="content-max mx-auto px-[clamp(20px,6vw,80px)] py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="font-space font-bold text-base text-electric-cyan"
          style={{ textShadow: '0 0 12px rgba(0, 240, 255, 0.3)' }}
        >
          B-20
        </span>

        <span className="font-mono-terminal text-[0.7rem] text-white/30">
          {t('footer.copyright')}
        </span>

        <button
          onClick={scrollToTop}
          className="font-inter font-medium text-[0.8rem] tracking-[0.1em] text-white/40 hover:text-electric-cyan transition-colors duration-300"
        >
          &uarr; {t('footer.back')}
        </button>
      </div>
    </footer>
  );
}
