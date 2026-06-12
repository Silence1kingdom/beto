import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Pencil } from 'lucide-react';
import { useEditableContent } from '@/hooks/useEditableContent';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_STAT_VALUES = [150, 3, 100];
const STAT_SUFFIXES = ['+', '', '%'];

function loadStatValues(): number[] {
  try {
    const stored = sessionStorage.getItem('edit_about.statValues');
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_STAT_VALUES;
}

export default function AboutSection() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAdmin();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [heading, editHeading] = useEditableContent(t('about.heading'), 'about.heading');
  const [body, editBody] = useEditableContent(t('about.body'), 'about.body');

  const stats = [
    { key: 'about.stat1', label: t('about.stat1') },
    { key: 'about.stat2', label: t('about.stat2') },
    { key: 'about.stat3', label: t('about.stat3') },
  ];

  const statValues = useMemo(() => loadStatValues(), []);

  const editStatValue = (index: number) => {
    const newValue = window.prompt('Edit stat value:', String(statValues[index]));
    if (newValue !== null) {
      const parsed = parseInt(newValue, 10);
      if (!isNaN(parsed)) {
        const newValues = [...loadStatValues()];
        newValues[index] = parsed;
        sessionStorage.setItem('edit_about.statValues', JSON.stringify(newValues));
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
      );
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 75%' } }
      );
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 70%' } }
      );

      if (statsRef.current) {
        const statNumbers = statsRef.current.querySelectorAll('.stat-number');
        statNumbers.forEach((el, i) => {
          const obj = { value: 0 };
          gsap.to(obj, {
            value: statValues[i] || DEFAULT_STAT_VALUES[i],
            duration: 1.5,
            ease: 'expo.out',
            delay: i * 0.2,
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
            onUpdate: () => {
              (el as HTMLElement).textContent = Math.round(obj.value) + (STAT_SUFFIXES[i] || '');
            },
          });
        });
        gsap.fromTo(
          statsRef.current.querySelectorAll('.stat-label'),
          { opacity: 0 },
          { opacity: 1, duration: 0.6, stagger: 0.2, ease: 'expo.out', scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
        );
      }
    }, section);
    return () => ctx.revert();
  }, [statValues]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-20"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(0, 240, 255, 0.04) 0%, transparent 60%)' }}
    >
      <div className="max-w-[900px] mx-auto section-padding">
        <div ref={labelRef} className="opacity-0">
          <SectionLabel text={t('about.label')} />
        </div>

        <div className="relative">
          <h2
            ref={headingRef}
            className="font-space font-bold text-white leading-[1.0] tracking-[-0.03em] max-w-[800px] opacity-0"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            {heading}
          </h2>
          {isAuthenticated && (
            <button
              onClick={() => editHeading()}
              className="absolute -top-2 -right-8 p-1 rounded text-white/30 hover:text-electric-cyan transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="relative mt-6">
          <p
            ref={bodyRef}
            className="font-inter text-white/70 max-w-[640px] opacity-0"
            style={{ fontSize: 'clamp(0.875rem, 1vw, 1rem)', lineHeight: 1.7, letterSpacing: '0.01em' }}
          >
            {body}
          </p>
          {isAuthenticated && (
            <button
              onClick={() => editBody()}
              className="absolute -top-2 -right-8 p-1 rounded text-white/30 hover:text-electric-cyan transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div ref={statsRef} className="flex flex-wrap items-center gap-12 mt-12">
          {stats.map((stat, i) => (
            <div key={stat.key} className="flex items-center gap-12">
              <div className="flex flex-col">
                <div className="relative inline-block">
                  <span
                    className="stat-number font-space font-bold text-electric-cyan"
                    style={{ fontSize: '2.5rem', textShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}
                  >
                    0
                  </span>
                  {isAuthenticated && (
                    <button
                      onClick={() => editStatValue(i)}
                      className="absolute -top-1 -right-6 p-0.5 rounded text-white/20 hover:text-electric-cyan transition-colors"
                    >
                      <Pencil className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
                <span className="stat-label text-white/50 text-[0.7rem] font-inter font-medium tracking-[0.15em] uppercase mt-1 opacity-0">
                  {stat.label}
                </span>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block w-[1px] h-12 bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
