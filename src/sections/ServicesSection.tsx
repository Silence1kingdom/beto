import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Layers, Gem, Network } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import PillTag from '@/components/PillTag';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Pencil } from 'lucide-react';
import { useEditableContent } from '@/hooks/useEditableContent';

gsap.registerPlugin(ScrollTrigger);

const defaultServices = [
  {
    number: '01',
    titleKey: 'services.dev.title',
    descKey: 'services.dev.desc',
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript'],
    icon: Code2,
  },
  {
    number: '02',
    titleKey: 'services.design.title',
    descKey: 'services.design.desc',
    tags: ['Figma', 'Design Systems', 'Prototyping'],
    icon: Layers,
  },
  {
    number: '03',
    titleKey: 'services.branding.title',
    descKey: 'services.branding.desc',
    tags: ['Identity', 'Strategy', 'Guidelines'],
    icon: Gem,
  },
  {
    number: '04',
    titleKey: 'services.ai.title',
    descKey: 'services.ai.desc',
    tags: ['OpenAI', 'LLM', 'Automation'],
    icon: Network,
  },
];

export default function ServicesSection() {
  const { t, dir } = useLanguage();
  const { isAuthenticated } = useAdmin();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [heading, editHeading] = useEditableContent(t('services.heading'), 'services.heading');

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const container = containerRef.current;
    if (!section || !track || !container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [labelRef.current, headingRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
      );

      const cards = track.children;
      const totalWidth = Array.from(cards).reduce((acc, card) => {
        return acc + (card as HTMLElement).offsetWidth + 32;
      }, 0) - 32;

      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth + 100;

      gsap.to(track, {
        x: dir === 'rtl' ? scrollDistance : -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${scrollDistance * 2}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      Array.from(cards).forEach((card) => {
        const elements = (card as HTMLElement).querySelectorAll('.service-animate');
        gsap.fromTo(
          elements,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: card as HTMLElement, start: 'top 85%', toggleActions: 'play none none reverse' } }
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative z-20">
      <div className="content-max mx-auto pt-[clamp(80px,12vh,160px)] px-[clamp(20px,6vw,80px)]">
        <div ref={labelRef} className="opacity-0">
          <SectionLabel text={t('services.label')} />
        </div>
        <div className="relative inline-block">
          <h2
            ref={headingRef}
            className="font-space font-bold text-white leading-[1.0] tracking-[-0.03em] mb-12 opacity-0"
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
      </div>

      <div ref={containerRef} className="relative min-h-[100dvh]">
        <div ref={trackRef} className="flex items-center gap-8 ps-[clamp(20px,6vw,80px)] h-[70vh]">
          {defaultServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.number}
                className="group relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-400 hover:border-electric-cyan/35"
                style={{
                  minWidth: '85vw',
                  maxWidth: '900px',
                  height: '70vh',
                  background: 'rgba(10, 14, 26, 0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 240, 255, 0.15)',
                }}
              >
                <div className="absolute top-0 left-8 w-10 h-[2px] gradient-cyan-purple" />
                <span
                  className="absolute top-6 right-8 font-space font-bold text-[5rem] leading-none pointer-events-none select-none"
                  style={{ color: 'rgba(0, 240, 255, 0.08)' }}
                >
                  {service.number}
                </span>

                <div className="relative h-full flex flex-col justify-end p-12">
                  <div className="service-animate mb-6">
                    <Icon size={48} className="text-electric-cyan transition-transform duration-600 group-hover:scale-110" />
                  </div>

                  <h3 className="service-animate font-space font-semibold text-white text-[1.75rem] tracking-[-0.01em]">
                    {t(service.titleKey)}
                  </h3>

                  <p
                    className="service-animate font-inter text-white/60 mt-3 max-w-[400px]"
                    style={{ fontSize: 'clamp(0.875rem, 1vw, 1rem)', lineHeight: 1.7 }}
                  >
                    {t(service.descKey)}
                  </p>

                  <div className="service-animate flex flex-wrap gap-2 mt-4">
                    {service.tags.map((tag) => (
                      <PillTag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
