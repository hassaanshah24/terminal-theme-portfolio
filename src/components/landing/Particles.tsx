"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles({ count = 100, scrollProgress }: { count?: number; scrollProgress: number }) {
  const meshRef = useRef<THREE.Points | null>(null);
  const particles = useRef<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
      colors[i * 3 + 2] = 1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particles.current = geometry;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || !particles.current) return;
    const time = state.clock.getElapsedTime();
    
    // Safe buffer attribute access with proper null checking
    const positionAttribute = particles.current.attributes.position as THREE.BufferAttribute;
    if (!positionAttribute || !positionAttribute.array) return;
    
    const positions = positionAttribute.array as Float32Array;
    if (!positions || positions.length === 0) return;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      if (i3 + 1 < positions.length && i3 < positions.length) {
        positions[i3 + 1] += Math.sin(time + i) * 0.01;
        positions[i3] += Math.cos(time + i * 0.5) * 0.005;
      }
    }

    positionAttribute.needsUpdate = true;
    meshRef.current.rotation.y = scrollProgress * Math.PI * 2;
  });

  return (
    <points ref={meshRef}>
      {particles.current && <primitive object={particles.current as THREE.BufferGeometry} />}
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
    </points>
  );
}


