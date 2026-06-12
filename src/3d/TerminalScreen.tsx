import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TERMINAL_LINES = [
  { text: '> b20-cli init --project portfolio', color: '#00F0FF' },
  { text: '> [OK] Loading 3D renderer... THREE.js v168', color: '#00FF88' },
  { text: '> [OK] WebGL context established', color: '#00FF88' },
  { text: '> npm install @b20/core @b20/ui @b20/three', color: '#FFFFFF' },
  { text: '> [BUILD] Compiling shaders...', color: '#B24BFF' },
  { text: '> [OK] Vertex shader: 144 instructions', color: '#00FF88' },
  { text: '> [OK] Fragment shader: 256 instructions', color: '#00FF88' },
  { text: '> b20-cli deploy --env production --cdn', color: '#00F0FF' },
  { text: '> [SUCCESS] Deployed to b20.studio', color: '#00FF88' },
  { text: '> [LIVE] Listening on port 443...', color: '#00FF88' },
  { text: '> [WEBSOCKET] Client connected: visitor_#8291', color: '#6B7280' },
];

const RANDOM_LINES = [
  () => `> [INFO] Memory usage: ${Math.floor(Math.random() * 30 + 40)}%`,
  () => `> [WEBSOCKET] ping: ${Math.floor(Math.random() * 20 + 10)}ms`,
  () => `> [RENDER] FPS: ${Math.floor(Math.random() * 15 + 55)}`,
  () => `> [ASSET] Texture loaded: 2048x2048`,
  () => `> [SHADER] Uniform updated: u_time`,
  () => `> [NETWORK] CDN cache hit: edge-node-03`,
];

const LINE_HEIGHT = 18;
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 200;

export default function TerminalScreen() {
  const meshRef = useRef<THREE.Mesh>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const linesRef = useRef<Array<{ text: string; color: string }>>([...TERMINAL_LINES]);
  const scrollOffsetRef = useRef(0);
  const cursorVisibleRef = useRef(true);
  const cursorTimerRef = useRef(0);
  const randomLineTimerRef = useRef(0);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctxRef.current = ctx;
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textBaseline = 'top';
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = tex;
    return tex;
  }, []);

  const frameSkipRef = useRef(0);

  useFrame((_, delta) => {
    const ctx = ctxRef.current;
    const tex = textureRef.current;
    if (!ctx || !tex) return;

    frameSkipRef.current++;
    const shouldRender = frameSkipRef.current % 3 === 0;

    scrollOffsetRef.current += delta * 20;

    cursorTimerRef.current++;
    if (cursorTimerRef.current > 48) {
      cursorVisibleRef.current = !cursorVisibleRef.current;
      cursorTimerRef.current = 0;
    }

    randomLineTimerRef.current++;
    if (randomLineTimerRef.current > 360) {
      const randomLine = RANDOM_LINES[Math.floor(Math.random() * RANDOM_LINES.length)]();
      const isGreen = randomLine.includes('[OK]') || randomLine.includes('[SUCCESS]');
      linesRef.current.push({
        text: randomLine,
        color: isGreen ? '#00FF88' : '#6B7280',
      });
      randomLineTimerRef.current = 0;
    }

    const maxVisibleLines = Math.ceil(CANVAS_HEIGHT / LINE_HEIGHT) + 5;
    while (linesRef.current.length > maxVisibleLines) {
      linesRef.current.shift();
      scrollOffsetRef.current -= LINE_HEIGHT;
    }
    if (scrollOffsetRef.current > CANVAS_HEIGHT * 2) {
      scrollOffsetRef.current = 0;
    }

    if (!shouldRender) return;

    ctx.fillStyle = '#080810';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const lines = linesRef.current;
    const startY = CANVAS_HEIGHT - (lines.length * LINE_HEIGHT) + scrollOffsetRef.current;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const y = startY + i * LINE_HEIGHT;
      if (y > -LINE_HEIGHT && y < CANVAS_HEIGHT + LINE_HEIGHT) {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 12, y);
      }
    }

    const lastLineY = startY + (lines.length - 1) * LINE_HEIGHT;
    if (lastLineY > -LINE_HEIGHT && lastLineY < CANVAS_HEIGHT && cursorVisibleRef.current) {
      const lastLine = lines[lines.length - 1];
      const textWidth = ctx.measureText(lastLine.text).width;
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(14 + textWidth, lastLineY, 8, 14);
    }

    tex.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.02, -0.72]} rotation={[-Math.PI / 2 + 0.02, 0, 0]}>
      <planeGeometry args={[1.9, 1.24]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
