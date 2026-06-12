import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
}

export default function FloatingParticles({ count = 100 }: FloatingParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002
      ),
      color: new THREE.Color(Math.random() > 0.5 ? '#00F0FF' : '#B24BFF'),
    }));
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    particles.forEach((p, i) => {
      dummy.position.copy(p.position);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, p.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [particles, dummy]);

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      particle.position.add(particle.velocity);

      const bound = 2.5;
      if (Math.abs(particle.position.x) > bound) {
        particle.position.x = -Math.sign(particle.position.x) * bound;
      }
      if (Math.abs(particle.position.y) > bound) {
        particle.position.y = -Math.sign(particle.position.y) * bound;
      }
      if (Math.abs(particle.position.z) > bound) {
        particle.position.z = -Math.sign(particle.position.z) * bound;
      }

      dummy.position.copy(particle.position);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.008, 8, 8]} />
      <meshBasicMaterial
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
