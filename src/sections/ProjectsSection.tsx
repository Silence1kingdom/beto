import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import PillTag from '@/components/PillTag';
import { useLanguage } from '@/contexts/LanguageContext';
import { firestoreService, type ProjectData } from '@/lib/firebase-firestore';

function ProjectImg({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  return error ? (
    <div className="w-full h-full flex items-center justify-center bg-deep-navy text-white/30 font-inter text-sm">
      Image not found
    </div>
  ) : (
    <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setError(true)} />
  );
}

gsap.registerPlugin(ScrollTrigger);

const fallbackProjects = [
  {
    id: 'default-1',
    titleKey: 'projects.1.title',
    descKey: 'projects.1.desc',
    tags: ['React', 'Three.js', 'AI'],
    image: '/project-showcase-1.jpg',
    rotateY: 5,
  },
  {
    id: 'default-2',
    titleKey: 'projects.2.title',
    descKey: 'projects.2.desc',
    tags: ['Next.js', 'Stripe', 'CMS'],
    image: '/project-showcase-2.jpg',
    rotateY: 0,
  },
  {
    id: 'default-3',
    titleKey: 'projects.3.title',
    descKey: 'projects.3.desc',
    tags: ['Python', 'OpenAI', 'React'],
    image: '/project-showcase-3.jpg',
    rotateY: -5,
  },
];

interface DisplayProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  rotateY: number;
}

export default function ProjectsSection() {
  const { t, dir } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<DisplayProject[]>(() => {
    const stored = localStorage.getItem('admin_projects');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((p: ProjectData) => ({
          id: p.id || String(Math.random()),
          title: p.title,
          description: p.description,
          tags: p.tags,
          image: p.image || '/project-showcase-1.jpg',
          rotateY: 0,
        }));
      } catch {}
    }
    return fallbackProjects.map((p) => ({
      id: p.id,
      title: t(p.titleKey),
      description: t(p.descKey),
      tags: p.tags,
      image: p.image,
      rotateY: p.rotateY,
    }));
  });

  useEffect(() => {
    firestoreService.getProjects().then((fb) => {
      if (fb.length > 0) {
        setProjects(
          fb.map((p) => ({
            id: p.id || String(Math.random()),
            title: p.title,
            description: p.description,
            tags: p.tags,
            image: p.image || '/project-showcase-1.jpg',
            rotateY: 0,
          }))
        );
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [labelRef.current, headingRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
      );

      if (gridRef.current) {
        const cards = gridRef.current.children;
        Array.from(cards).forEach((card, i) => {
          const rotateDir = dir === 'rtl' ? (i === 0 ? -15 : i === 2 ? 15 : 0) : (i === 0 ? 15 : i === 2 ? -15 : 0);
          gsap.fromTo(
            card,
            { opacity: 0, rotateY: rotateDir, rotateX: 10 },
            { opacity: 1, rotateY: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card as HTMLElement, start: 'top 85%' } }
          );
          gsap.to(card, {
            y: -20,
            ease: 'none',
            scrollTrigger: { trigger: card as HTMLElement, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      }
    }, section);
    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-20"
      style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(59, 107, 255, 0.05) 0%, transparent 60%)' }}
    >
      <div className="content-max mx-auto section-padding">
        <div ref={labelRef} className="opacity-0">
          <SectionLabel text={t('projects.label')} />
        </div>

        <h2
          ref={headingRef}
          className="font-space font-bold text-white leading-[1.0] tracking-[-0.03em] mb-16 opacity-0"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          {t('projects.heading')}
        </h2>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-xl overflow-hidden transition-all duration-500 opacity-0"
              style={{
                transformStyle: 'preserve-3d',
                background: 'rgba(10, 14, 26, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 240, 255, 0.15)',
                transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  (e.currentTarget as HTMLElement).style.transform = 'rotateY(0deg) rotateX(-3deg) translateZ(30px)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'rotateY(0deg)';
              }}
            >
              <div className="relative aspect-video overflow-hidden">
                <ProjectImg src={project.image} alt={project.title} />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(5, 5, 8, 0.8) 0%, transparent 50%)' }}
                />
              </div>

              <div className="p-6">
                <h3 className="font-space font-semibold text-white text-xl tracking-[-0.01em]">
                  {project.title}
                </h3>
                <p
                  className="font-inter text-white/55 mt-2 line-clamp-2"
                  style={{ fontSize: '0.8rem', lineHeight: 1.6 }}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <PillTag key={tag} text={tag} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
