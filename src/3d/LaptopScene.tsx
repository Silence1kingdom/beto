import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import TerminalScreen from './TerminalScreen';
import FloatingParticles from './FloatingParticles';

function LaptopModel() {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Idle rotation - gentle sway
      groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.15;
      // Idle float - subtle bobbing
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.05;
    }
  });

  const laptopMaterial = new THREE.MeshStandardMaterial({
    color: '#1a1a24',
    roughness: 0.3,
    metalness: 0.85,
  });

  const bezelMaterial = new THREE.MeshStandardMaterial({
    color: '#0a0a10',
    roughness: 0.5,
    metalness: 0.6,
  });

  const keyboardMaterial = new THREE.MeshStandardMaterial({
    color: '#12121a',
    roughness: 0.7,
    metalness: 0.3,
  });

  const hingeMaterial = new THREE.MeshStandardMaterial({
    color: '#151520',
    roughness: 0.4,
    metalness: 0.9,
  });

  return (
    <group ref={groupRef}>
      {/* Laptop Base */}
      <RoundedBox args={[2.2, 0.08, 1.5]} radius={0.02} smoothness={2} position={[0, 0, 0]}>
        <primitive object={laptopMaterial} attach="material" />
      </RoundedBox>

      {/* Keyboard area */}
      <mesh position={[0, 0.045, 0.05]}>
        <boxGeometry args={[1.8, 0.005, 1.0]} />
        <primitive object={keyboardMaterial} attach="material" />
      </mesh>

      {/* Hinge */}
      <mesh position={[0, 0.04, -0.72]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2.0, 6]} />
        <primitive object={hingeMaterial} attach="material" />
      </mesh>

      {/* Lid Group - rotated open */}
      <group ref={lidRef} position={[0, 0.04, -0.72]} rotation={[-0.95, 0, 0]}>
        {/* Lid back */}
        <RoundedBox args={[2.2, 0.04, 1.5]} radius={0.02} smoothness={2} position={[0, 0, -0.75]}>
          <primitive object={laptopMaterial} attach="material" />
        </RoundedBox>

        {/* Bezel */}
        <mesh position={[0, -0.025, -0.75]}>
          <boxGeometry args={[2.2, 0.01, 1.5]} />
          <primitive object={bezelMaterial} attach="material" />
        </mesh>

        {/* Terminal Screen */}
        <TerminalScreen />
      </group>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    const targetX = mouseRef.current.x * 0.3;
    const targetY = mouseRef.current.y * 0.15 + 0.5;

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.2} color="#1a1a2e" />
      <pointLight position={[0, 0.2, 0.3]} color="#00F0FF" intensity={1.5} distance={3} />
      <directionalLight position={[2, 3, 2]} intensity={0.3} color="#ffffff" />

      <fogExp2 attach="fog" args={['#050508', 0.03]} />

      <LaptopModel />

      <FloatingParticles count={30} />

      <CameraController />
    </>
  );
}

export default function LaptopScene() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
