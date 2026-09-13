'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Petal({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.5;
    ref.current.rotation.y = t * 0.25;
    ref.current.rotation.z = Math.cos(t * 0.3) * 0.4;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          thickness={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function Ring({ position, color }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[1.5, 0.035, 16, 100]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

function Particles({ count = 90 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#c6a15b" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/**
 * Elegant, performance-conscious 3D accent: floating glass petals,
 * a gold ring and soft particles. Disabled entirely when the user
 * prefers reduced motion (handled by the parent via dynamic import).
 */
export default function Hero3D({ compact = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <pointLight position={[-5, -2, 3]} intensity={0.6} color="#f2d8cf" />
      <Petal position={compact ? [0, 0.4, 0] : [1.8, 0.5, -1]} color="#e9c9c0" scale={compact ? 1 : 1.25} />
      <Petal position={compact ? [1.4, -0.9, -1] : [3.1, -1.1, -1.6]} color="#f6e3d3" scale={0.7} speed={1.3} />
      {!compact && <Petal position={[0.4, -1.5, -0.5]} color="#d8a7ae" scale={0.5} speed={0.8} />}
      <Ring position={compact ? [0, 0.2, -1.5] : [1.8, 0.3, -2]} color="#c6a15b" />
      <Particles count={compact ? 40 : 90} />
      <ContactShadows position={[0, -2.6, 0]} opacity={0.18} blur={2.6} color="#241b16" />
    </Canvas>
  );
}
