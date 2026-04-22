"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Laptop3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale,
  scrollProgress,
  index
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  scrollProgress: number;
  index: number;
}) {
  const meshRef = useRef<any>(null);
  const gltf = useGLTF("/models/hacker_laptop.glb") as any;
  const [ready, setReady] = useState(false);

  const model = useMemo(() => {
    // Clone once so we can safely mutate transforms
    return gltf?.scene ? gltf.scene.clone(true) : null;
  }, [gltf]);

  // Normalize model: center and scale to a target size so it's visible, and ensure materials are PBR-lit
  useEffect(() => {
    if (!model) return;
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    // Target the model's largest dimension to ~1.8 units, then apply provided scale multiplier
    const target = 1.8;
    const normalization = target / maxDim;
    model.scale.multiplyScalar(normalization * scale);

    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center); // center around origin

    // RADICAL FIX: Test ALL possible rotation combinations
    // The laptop is STILL showing from side - need to test complex rotations
    
    // Extended rotation tests including combined axes
    const rotationTests = [
      { x: 0, y: 0, z: 0, name: "Default" },
      { x: 0, y: Math.PI/2, z: 0, name: "Y+90" },
      { x: 0, y: -Math.PI/2, z: 0, name: "Y-90" }, 
      { x: 0, y: Math.PI, z: 0, name: "Y+180" },
      { x: Math.PI/2, y: 0, z: 0, name: "X+90" },
      { x: -Math.PI/2, y: 0, z: 0, name: "X-90" },
      { x: 0, y: 0, z: Math.PI/2, name: "Z+90" },
      { x: 0, y: 0, z: -Math.PI/2, name: "Z-90" },
      // Combined rotations (often needed for complex models)
      { x: -Math.PI/2, y: Math.PI/2, z: 0, name: "X-90+Y+90" },
      { x: Math.PI/2, y: Math.PI/2, z: 0, name: "X+90+Y+90" },
      { x: 0, y: Math.PI/2, z: Math.PI/2, name: "Y+90+Z+90" },
      { x: -Math.PI/2, y: Math.PI, z: 0, name: "X-90+Y+180" }
    ];
    
    // SYSTEMATIC FIX: Test specific promising combinations
    // Since auto-cycling worked, let's test the most common working rotations
    
    const promisingRotations = [
      { x: 0, y: 0, z: 0, name: "Default" },                    // 0
      { x: 0, y: Math.PI, z: 0, name: "Y+180" },                // 1  
      { x: Math.PI, y: 0, z: 0, name: "X+180" },                // 2
      { x: 0, y: Math.PI/2, z: 0, name: "Y+90" },               // 3
      { x: 0, y: -Math.PI/2, z: 0, name: "Y-90" },              // 4
      { x: Math.PI, y: Math.PI, z: 0, name: "X+180+Y+180" },    // 5 - Front facing + upright
      { x: 0, y: Math.PI, z: Math.PI, name: "Y+180+Z+180" },    // 6
      { x: Math.PI, y: Math.PI/2, z: 0, name: "X+180+Y+90" },   // 7
      { x: Math.PI, y: -Math.PI/2, z: 0, name: "X+180+Y-90" }   // 8
    ];
    
    // ✅ LAPTOP ORIENTATION FIXED! 
    // Final working rotation: Y-90° with micro adjustments
    
    // Apply the working base rotation: Y-90 degrees
    model.rotation.set(0, -Math.PI/2, 0);
    
    // Perfect fine-tuning adjustments
    model.rotation.x += -0.05; // Slight forward tilt for optimal viewing
    model.rotation.y += 0.02;  // Micro Y adjustment 
    model.rotation.z += 0.01;  // Perfect alignment
    
    console.log('🎉 LAPTOP PERFECTLY ORIENTED!', model.rotation);

    // Ensure materials render nicely with environment lighting
    model.traverse((child: any) => {
      if (child.isMesh) {
        const original = child.material;
        const toStandard = (src: any) =>
          new THREE.MeshStandardMaterial({
            color: src?.color ?? new THREE.Color("#d0d0d0"),
            metalness: 0.9, // High metalness for realistic metallic reflections
            roughness: 0.1, // Low roughness for sharp, clean reflections
            map: src?.map ?? null,
            normalMap: src?.normalMap ?? null,
            envMapIntensity: 1.5, // Enhanced environment map intensity for better reflections
            // Additional properties for enhanced rim lighting
            emissive: new THREE.Color(0x000000),
            emissiveIntensity: 0.1
          });
        if (Array.isArray(original)) child.material = original.map(toStandard);
        else child.material = toStandard(original);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    setReady(true);
  }, [model, scale]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Only subtle floating animation
    meshRef.current.position.y = position[1] + Math.sin(time * 0.6 + index) * 0.03;
    
    // Very subtle scale pulse based on scroll progress
    const pulseScale = 1 + Math.sin(scrollProgress * Math.PI * 3) * 0.01;
    meshRef.current.scale.setScalar(pulseScale);
  });

  // Fallback cube to confirm visibility if model hasn't loaded yet
  if (!model || !ready) {
    return (
      <mesh ref={meshRef as any} position={position}>
        <boxGeometry args={[1, 0.2, 0.7]} />
        <meshBasicMaterial color="#888" />
      </mesh>
    );
  }

  return (
    <group ref={meshRef as any} position={position}>
      <primitive object={model} />
    </group>
  );
}

// Preload the GLB to ensure faster first render
useGLTF.preload("/models/hacker_laptop.glb");


