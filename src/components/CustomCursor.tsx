import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const handlePointerEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.cursor === 'pointer'
      ) {
        isHoveringRef.current = true;
      }
    };

    const handlePointerLeave = () => {
      isHoveringRef.current = false;
    };

    const animate = () => {
      const lerp = 0.15;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      if (cursor) {
        const size = isHoveringRef.current ? 40 : 8;
        const border = isHoveringRef.current ? '1.5px solid rgba(0, 240, 255, 0.8)' : 'none';
        const bg = isHoveringRef.current ? 'transparent' : 'rgba(0, 240, 255, 1)';
        const shadow = isHoveringRef.current
          ? '0 0 20px rgba(0, 240, 255, 0.3)'
          : '0 0 12px rgba(0, 240, 255, 0.6)';

        cursor.style.transform = `translate(${posRef.current.x - size / 2}px, ${posRef.current.y - size / 2}px)`;
        cursor.style.width = `${size}px`;
        cursor.style.height = `${size}px`;
        cursor.style.background = bg;
        cursor.style.border = border;
        cursor.style.boxShadow = shadow;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handlePointerEnter, true);
    document.addEventListener('mouseleave', handlePointerLeave, true);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handlePointerEnter, true);
      document.removeEventListener('mouseleave', handlePointerLeave, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (window.innerWidth < 768) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-screen hidden md:block"
      style={{
        width: 8,
        height: 8,
        background: 'rgba(0, 240, 255, 1)',
        boxShadow: '0 0 12px rgba(0, 240, 255, 0.6)',
        transition: 'width 0.3s, height 0.3s, background 0.3s, border 0.3s, box-shadow 0.3s',
        transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
      }}
    />
  );
}
