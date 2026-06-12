import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import { useLanguage } from '@/contexts/LanguageContext';
import { firestoreService, type TeamMemberData } from '@/lib/firebase-firestore';

gsap.registerPlugin(ScrollTrigger);

function AvatarImg({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  return error ? (
    <div className="w-full h-full flex items-center justify-center bg-deep-navy text-electric-cyan font-space font-bold text-lg">
      {alt.split(' ').map((w) => w[0]).join('').slice(0, 2)}
    </div>
  ) : (
    <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" onError={() => setError(true)} />
  );
}

interface DisplayMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export default function TeamSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [members, setMembers] = useState<DisplayMember[]>(() => {
    const stored = localStorage.getItem('admin_team_members');
    if (stored) {
      try {
        return JSON.parse(stored).map((m: TeamMemberData) => ({
          id: m.id || String(Math.random()),
          name: m.name,
          role: m.role,
          avatar: m.avatar || '/team-dark-phantom.jpg',
        }));
      } catch {}
    }
    return [
      { id: 'default-1', name: 'Ahmed El Gendy', role: 'Lead Web Designer / Developer', avatar: '/team-dark-phantom.jpg' },
      { id: 'default-2', name: 'Ahmed Hamdy', role: 'Frontend Developer / UI Specialist', avatar: '/team-volt.jpg' },
      { id: 'default-3', name: 'Elshaarawy', role: 'UI/UX Designer / Creative Developer', avatar: '/team-almany.jpg' },
    ];
  });

  useEffect(() => {
    firestoreService.getTeamMembers().then((fb) => {
      if (fb.length > 0) {
        setMembers(
          fb.map((m) => ({
            id: m.id || String(Math.random()),
            name: m.name,
            role: m.role,
            avatar: m.avatar || '/team-dark-phantom.jpg',
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
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
      );
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 75%' } }
      );
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' } }
        );
      }
    }, section);
    return () => ctx.revert();
  }, [members]);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative z-20"
      style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(178, 75, 255, 0.05) 0%, transparent 60%)' }}
    >
      <div className="content-max mx-auto section-padding">
        <div ref={labelRef} className="opacity-0">
          <SectionLabel text={t('team.label')} />
        </div>

        <h2
          ref={headingRef}
          className="font-space font-bold text-white leading-[1.0] tracking-[-0.03em] mb-16 opacity-0"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          {t('team.heading')}
        </h2>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {members.map((member, i) => (
            <div key={member.id} className={`${i === 1 ? 'md:mt-10' : ''}`}>
              <div
                className="group relative rounded-xl overflow-hidden transition-all duration-400 hover:-translate-y-2"
                style={{
                  animation: `float-${(i % 3) + 1} 3s ease-in-out infinite`,
                  transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'conic-gradient(from var(--angle), transparent 0%, #00F0FF 15%, #B24BFF 35%, #00F0FF 55%, transparent 70%)',
                    animation: 'rotate-border 4s linear infinite',
                    padding: '2px',
                  }}
                />
                <div
                  className="relative m-[2px] rounded-[10px] p-8 flex flex-col items-center text-center"
                  style={{ background: 'rgba(10, 14, 26, 0.85)', backdropFilter: 'blur(24px)' }}
                >
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden mb-5 transition-transform duration-400 group-hover:scale-105"
                    style={{ boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
                  >
                    <AvatarImg src={member.avatar} alt={member.name} />
                  </div>

                  <p className="font-inter font-medium text-white/80 text-[0.95rem] mt-1">{member.name}</p>
                  <p className="font-inter text-white/50 text-[0.7rem] tracking-[0.15em] mt-2">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
