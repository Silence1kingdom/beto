import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Globe, Lock, Menu, X } from 'lucide-react';

export default function Navigation() {
  const { t, lang, toggleLang } = useLanguage();
  const { isAuthenticated } = useAdmin();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: t('nav.about'), target: '#about' },
    { label: t('nav.team'), target: '#team' },
    { label: t('nav.services'), target: '#services' },
    { label: t('nav.projects'), target: '#projects' },
    { label: t('nav.contact'), target: '#contact' },
  ];

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-400 ${
        scrolled
          ? 'bg-void-black/60 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)' }}
    >
      <div className="flex items-center justify-between px-[clamp(20px,6vw,80px)] py-5">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMobileOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-space font-bold text-xl tracking-[-0.03em] text-electric-cyan"
          style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.4)' }}
        >
          B-20
        </a>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.target}
              href={link.target}
              onClick={(e) => handleNavClick(e, link.target)}
              className="group relative font-inter font-medium text-[0.8rem] tracking-[0.1em] text-white/60 hover:text-white transition-colors duration-300"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-electric-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}

          <button
            onClick={toggleLang}
            aria-label={`Switch language to ${lang === 'en' ? 'Arabic' : 'English'}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-electric-cyan/40 transition-all text-[0.7rem] font-inter font-medium tracking-wider uppercase"
          >
            <Globe className="h-3 w-3" />
            {lang === 'en' ? 'AR' : 'EN'}
          </button>

          <a
            href={isAuthenticated ? '/admin' : '/admin/login'}
            aria-label={isAuthenticated ? 'Dashboard' : 'Login'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-electric-cyan/30 text-electric-cyan text-[0.7rem] font-inter font-medium tracking-wider uppercase hover:bg-electric-cyan/10 transition-all"
          >
            <Lock className="h-3 w-3" />
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </a>
        </div>
      </div>

      {mobileOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-t border-electric-cyan/10 bg-void-black/95 backdrop-blur-xl"
        >
          <div className="flex flex-col px-[clamp(20px,6vw,80px)] py-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.target}
                href={link.target}
                onClick={(e) => handleNavClick(e, link.target)}
                className="font-inter text-white/80 hover:text-electric-cyan transition-colors py-2 text-[0.9rem]"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-electric-cyan/10" />
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => { toggleLang(); setMobileOpen(false); }}
                aria-label={`Switch language to ${lang === 'en' ? 'Arabic' : 'English'}`}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 text-white/60 hover:text-white hover:border-electric-cyan/40 transition-all text-[0.8rem] font-inter font-medium tracking-wider uppercase"
              >
                <Globe className="h-4 w-4" />
                {lang === 'en' ? 'AR' : 'EN'}
              </button>
              <a
                href={isAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-electric-cyan/30 text-electric-cyan text-[0.8rem] font-inter font-medium tracking-wider uppercase hover:bg-electric-cyan/10 transition-all"
              >
                <Lock className="h-4 w-4" />
                {isAuthenticated ? 'Dashboard' : 'Login'}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
