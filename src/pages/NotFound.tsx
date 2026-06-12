import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import NeonButton from '@/components/NeonButton';

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  return (
    <div className="min-h-screen bg-void-black flex flex-col items-center justify-center text-center px-6">
      <h1
        className="font-space font-bold text-electric-cyan leading-[1.0] tracking-[-0.04em]"
        style={{ fontSize: 'clamp(5rem, 15vw, 10rem)', textShadow: '0 0 60px rgba(0, 240, 255, 0.3)' }}
      >
        404
      </h1>
      <p className="font-inter text-white/50 mt-4 max-w-md" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="mt-10">
        <NeonButton onClick={() => navigate('/')}>
          Back to Home
        </NeonButton>
      </div>
    </div>
  );
}