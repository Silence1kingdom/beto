import { lazy, Suspense } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import Navigation from '@/components/Navigation';

import AdminBar from '@/components/admin/AdminBar';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import TeamSection from '@/sections/TeamSection';
import ServicesSection from '@/sections/ServicesSection';
import ProjectsSection from '@/sections/ProjectsSection';
import ContactSection from '@/sections/ContactSection';
import FooterSection from '@/sections/FooterSection';

const LaptopScene = lazy(() => import('@/3d/LaptopScene'));

export default function App() {
  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <Suspense fallback={<div className="fixed inset-0 bg-void-black z-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-electric-cyan/30 border-t-electric-cyan rounded-full animate-spin" /></div>}>
          <LaptopScene />
        </Suspense>
        <Navigation />
        <AdminBar />
        <main className="relative">
          <HeroSection />
          <AboutSection />
          <TeamSection />
          <ServicesSection />
          <ProjectsSection />
          <ContactSection />
          <FooterSection />
        </main>
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}
