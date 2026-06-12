import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, LogOut, Settings } from 'lucide-react';

export default function AdminBar() {
  const { isAuthenticated, logout } = useAdmin();
  const { lang, toggleLang } = useLanguage();

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
      <div
        className="flex items-center gap-4 px-5 py-3 rounded-full backdrop-blur-xl"
        style={{
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)',
        }}
      >
        <Shield className="h-4 w-4 text-electric-cyan" />
        <span className="text-[0.7rem] font-inter font-medium text-electric-cyan tracking-wider uppercase">
          Admin Mode
        </span>

        <div className="w-px h-5 bg-electric-cyan/20" />

        <button
          onClick={toggleLang}
          className="text-[0.65rem] font-inter font-bold text-white/60 hover:text-electric-cyan transition-colors uppercase tracking-wider"
        >
          {lang === 'en' ? 'العربية' : 'English'}
        </button>

        <a
          href="/admin"
          className="flex items-center gap-1.5 text-[0.65rem] font-inter font-medium text-white/60 hover:text-electric-cyan transition-colors"
        >
          <Settings className="h-3 w-3" />
          Dashboard
        </a>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-[0.65rem] font-inter font-medium text-white/40 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-3 w-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
