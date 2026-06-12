import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NeonButton from '@/components/NeonButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Pencil } from 'lucide-react';
import { useEditableContent } from '@/hooks/useEditableContent';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAdmin();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const [subtitle, editSubtitle] = useEditableContent(t('hero.subtitle'), 'hero.subtitle');

  useEffect(() => {
    const section = sectionRef.current;
    const buttons = buttonsRef.current;
    if (!section || !buttons) return;

    const titleEl = titleRef.current;
    const subtitleEl = subtitleRef.current;

    const ctx = gsap.context(() => {
      if (titleEl) {
        const chars = titleEl.textContent?.split('') || [];
        titleEl.innerHTML = chars.map((c) => `<span class="inline-block">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
        const charSpans = titleEl.querySelectorAll('span');

        const tl = gsap.timeline({ delay: 0.8 });
        tl.fromTo(
          charSpans,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 }
        );
        tl.fromTo(
          subtitleEl,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
          '-=0.3'
        );
        tl.fromTo(
          buttons.children,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out', stagger: 0.1 },
          '-=0.2'
        );

        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top top', end: '+=200', scrub: true, pin: false },
        });
        scrollTl.to([titleEl, subtitleEl, buttons], { opacity: 0, y: -30, stagger: 0.05 });

        return () => {
          tl.kill();
          scrollTl.kill();
        };
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-end pb-[15vh] z-10"
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #050508 0%, transparent 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1
          ref={titleRef}
          className="font-space font-bold text-white leading-[0.95] tracking-[-0.04em] mb-4"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            textShadow: '0 0 40px rgba(0, 240, 255, 0.3), 0 0 80px rgba(178, 75, 255, 0.15)',
          }}
        >
          B-20
        </h1>

        <div className="relative">
          <p
            ref={subtitleRef}
            className="font-inter text-white/60 max-w-[520px] mb-8 opacity-0"
            style={{
              fontSize: 'clamp(0.875rem, 1vw, 1rem)',
              lineHeight: 1.7,
              letterSpacing: '0.01em',
            }}
          >
            {subtitle}
          </p>
          {isAuthenticated && (
            <button
              onClick={() => editSubtitle()}
              className="absolute -top-2 -right-8 p-1 rounded text-white/30 hover:text-electric-cyan transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div ref={buttonsRef} className="flex items-center gap-4 flex-wrap justify-center">
          <NeonButton onClick={() => handleScrollTo('#projects')}>
            {t('hero.explore')}
          </NeonButton>
          <NeonButton variant="ghost" onClick={() => handleScrollTo('#team')}>
            {t('hero.meet')}
          </NeonButton>
        </div>
      </div>
    </section>
  );
}
