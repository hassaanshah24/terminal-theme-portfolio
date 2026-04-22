"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import Laptop3D from "./Laptop3D";
import Particles from "./Particles";

export default function Scene({ scrollProgress }: { scrollProgress: number }) {
  const { camera, scene, gl } = useThree();
  const laptopGroupRef = useRef<THREE.Group | null>(null);
  const cameraRigRef = useRef<THREE.Group | null>(null);
  const lightRigRef = useRef<THREE.Group | null>(null);
  const energyFieldRef = useRef<THREE.Mesh | null>(null);

  // Error handling for useThree
  if (!camera || !scene || !gl) {
    return null;
  }

  // Simple materials to avoid shader issues
  const holographicMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x1f2937,
      transparent: true,
      opacity: 0.3,
    });
  }, []);

  const energyFieldMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
  }, []);

  useEffect(() => {
    // Simple, working lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);

    // Store lights in a rig and mount rig to the scene.
    // Adding lights to both scene and group detaches them from scene.
    lightRigRef.current = new THREE.Group();
    lightRigRef.current.add(ambientLight, directionalLight);
    scene.add(lightRigRef.current);

    // Enhanced realistic grid system - positioned well below laptop
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const gridSize = isMobile ? 20 : 30; // Smaller grid on mobile
    const gridDivisions = isMobile ? 20 : 30; // Fewer divisions on mobile
    const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x404040, 0x2a2a2a);
    grid.position.y = -3.0; // Move grid much lower to avoid interference
    grid.material.opacity = isMobile ? 0.3 : 0.5; // Less visible on mobile for performance
    grid.material.transparent = true;
    scene.add(grid);
    
    // Removed center cross to avoid lines over laptop

    // Energy field sphere - positioned behind laptop for atmospheric effect
    const sphereSegments = isMobile ? 32 : 64; // Fewer segments on mobile
    const energyGeometry = new THREE.SphereGeometry(12, sphereSegments, sphereSegments);
    const energyField = new THREE.Mesh(energyGeometry, energyFieldMaterial);
    energyField.position.set(0, 0, -8); // Positioned behind laptop
    scene.add(energyField);
    energyFieldRef.current = energyField;

    // Camera rig for cinematic movements
    const cameraRig = new THREE.Group();
    scene.add(cameraRig);
    cameraRigRef.current = cameraRig;

    return () => {
      if (lightRigRef.current) {
        scene.remove(lightRigRef.current);
      }
      scene.remove(grid, energyField, cameraRig);
    };
  }, [scene, holographicMaterial, energyFieldMaterial]);

  useFrame((state, delta) => {
    try {
      const t = scrollProgress;
      const time = state.clock.getElapsedTime();
    
      // Simple material updates
      if (holographicMaterial) {
        holographicMaterial.opacity = 0.3 + Math.sin(time * 2) * 0.1;
      }
      
      if (energyFieldMaterial) {
        energyFieldMaterial.opacity = 0.1 + Math.sin(time * 1.5) * 0.05;
      }

      // Ultra-smooth easing functions for buttery movement
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easeOutElastic = (t: number) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
      };
      const easeInOutBack = (t: number) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
          ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
          : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
      };
      const easeOutBounce = (t: number) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
          return n1 * t * t;
        } else if (t < 2 / d1) {
          return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
          return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
          return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
      };
      const easeInOutQuart = (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
      const easeOutCirc = (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2));
      
      // Additional smooth easing functions
      const easeInOutQuint = (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
      const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

      // Ultra-smooth cinematic camera system
      let cameraPos = new THREE.Vector3();
      let cameraLookAt = new THREE.Vector3();
      let cameraRoll = 0;

      if (t < 0.25) {
        // HERO: Smooth dramatic reveal
        const progress = t / 0.25;
        const smoothProgress = easeOutExpo(progress);
        
        // Smooth camera sweep down
        cameraPos.set(
          Math.sin(progress * Math.PI) * 2, // Gentler horizontal movement
          10 - smoothProgress * 6, // Smoother vertical descent
          8 - smoothProgress * 1 // Subtle forward movement
        );
        cameraLookAt.set(0, smoothProgress * -0.3, 0);
        cameraRoll = -progress * 0.05; // Reduced roll for smoothness

      } else if (t < 0.5) {
        // EXPLORATION: Gentle orbital movement
        const progress = (t - 0.25) / 0.25;
        const smoothProgress = easeInOutSine(progress);
        
        const orbitalAngle = smoothProgress * Math.PI * 0.6; // Reduced angle for smoothness
        cameraPos.set(
          Math.cos(orbitalAngle) * 7, // Closer for better view
          3 + Math.sin(smoothProgress * Math.PI) * 1, // Smoother height variation
          Math.sin(orbitalAngle) * 7
        );
        cameraLookAt.set(
          Math.cos(orbitalAngle) * 0.3, // Gentler look-at movement
          0,
          Math.sin(orbitalAngle) * 0.3
        );

      } else if (t < 0.75) {
        // CREATION: Smooth close-up angles
        const progress = (t - 0.5) / 0.25;
        const smoothProgress = easeInOutQuint(progress);
        
        cameraPos.set(
          -3 + smoothProgress * 6, // Smoother horizontal movement
          2 + Math.sin(smoothProgress * Math.PI) * 0.5, // Gentler height variation
          5 - smoothProgress * 1 // Subtle forward movement
        );
        cameraLookAt.set(smoothProgress * 0.3, 0, 0);
        cameraRoll = Math.sin(smoothProgress * Math.PI) * 0.02; // Reduced roll

      } else {
        // VISION: Smooth pull-back reveal
        const progress = (t - 0.75) / 0.25;
        const smoothProgress = easeOutExpo(progress);
        
        cameraPos.set(
          0,
          3 + smoothProgress * 4, // Smoother height increase
          4 + smoothProgress * 8 // Smoother distance increase
        );
        cameraLookAt.set(0, -smoothProgress * 1, -smoothProgress * 2);
        cameraRoll = 0;
      }

      // Apply camera transformations with smooth interpolation
      camera.position.lerp(cameraPos, 0.1); // Smooth camera movement
      camera.lookAt(cameraLookAt);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, cameraRoll, 0.1); // Smooth roll

      // Laptop choreography - single laptop with realistic 3D rotations
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      let targetX = 0, targetY = 0, targetZ = 0, targetScale = isMobile ? 1.2 : 1.5; // Smaller scale on mobile
      let targetRotationX = 0, targetRotationY = 0, targetRotationZ = 0;
      const rotationIntensity = isMobile ? 0.5 : 1; // Reduced rotation intensity on mobile

      if (t < 0.2) {
        // HERO ENTRANCE - Smooth emergence
        const progress = t / 0.2;
        const smoothProgress = easeOutExpo(progress);
        
        targetX = 0;
        targetY = isMobile ? -1.0 : 0; // Move laptop much higher on mobile
        targetZ = -8 + smoothProgress * 8;
        targetScale = (isMobile ? 0.3 : 0.5) + smoothProgress * (isMobile ? 0.9 : 1.0);
        
        // Smooth entrance rotation
        targetRotationX = THREE.MathUtils.lerp(-0.2, 0, smoothProgress);
        targetRotationY = 0;
        targetRotationZ = 0;

      } else if (t < 0.4) {
        // CENTER FOCUS - Gentle floating
        const progress = (t - 0.2) / 0.2;
        const smoothProgress = easeInOutSine(progress);
        
        targetX = 0;
        targetY = (isMobile ? -1.0 : 0) + Math.sin(time * 0.8) * (isMobile ? 0.1 : 0.2); // Keep laptop much higher on mobile
        targetZ = 0;
        targetScale = isMobile ? 1.2 : 1.5;
        
        // Gentle floating rotations - reduced on mobile
        targetRotationX = Math.sin(time * 0.6) * 0.05 * rotationIntensity;
        targetRotationY = Math.sin(time * 0.4) * 0.03 * rotationIntensity;
        targetRotationZ = Math.sin(time * 0.7) * 0.02 * rotationIntensity;

      } else if (t < 0.6) {
        // LEFT MOVEMENT - Smooth slide
        const progress = (t - 0.4) / 0.2;
        const smoothProgress = easeInOutQuint(progress);
        
        targetX = THREE.MathUtils.lerp(0, isMobile ? -3 : -4, smoothProgress); // Reduced movement on mobile
        targetY = Math.sin(time * 0.6) * (isMobile ? 0.1 : 0.15);
        targetZ = 0;
        targetScale = isMobile ? 1.2 : 1.5;
        
        // Smooth turning - reduced on mobile
        targetRotationX = Math.sin(time * 0.5) * 0.08 * rotationIntensity;
        targetRotationY = THREE.MathUtils.lerp(0, isMobile ? -0.2 : -0.3, smoothProgress);
        targetRotationZ = THREE.MathUtils.lerp(0, isMobile ? -0.05 : -0.1, smoothProgress);

      } else if (t < 0.8) {
        // RIGHT MOVEMENT - Smooth slide
        const progress = (t - 0.6) / 0.2;
        const smoothProgress = easeInOutQuint(progress);
        
        targetX = THREE.MathUtils.lerp(isMobile ? -3 : -4, isMobile ? 3 : 4, smoothProgress);
        targetY = Math.sin(time * 0.6) * (isMobile ? 0.1 : 0.15);
        targetZ = 0;
        targetScale = isMobile ? 1.2 : 1.5;
        
        // Smooth turning - reduced on mobile
        targetRotationX = Math.sin(time * 0.5) * 0.08 * rotationIntensity;
        targetRotationY = THREE.MathUtils.lerp(isMobile ? -0.2 : -0.3, isMobile ? 0.2 : 0.3, smoothProgress);
        targetRotationZ = THREE.MathUtils.lerp(isMobile ? -0.05 : -0.1, isMobile ? 0.05 : 0.1, smoothProgress);

      } else {
        // FINAL CENTER - Smooth return
        const progress = (t - 0.8) / 0.2;
        const smoothProgress = easeOutExpo(progress);
        
        targetX = THREE.MathUtils.lerp(isMobile ? 3 : 4, 0, smoothProgress);
        targetY = Math.sin(time * 0.4) * (isMobile ? 0.05 : 0.1);
        targetZ = 0;
        targetScale = (isMobile ? 1.2 : 1.5) + smoothProgress * (isMobile ? 0.2 : 0.3);
        
        // Smooth return to center - reduced on mobile
        targetRotationX = Math.sin(time * 0.4) * 0.05 * rotationIntensity;
        targetRotationY = THREE.MathUtils.lerp(isMobile ? 0.2 : 0.3, 0, smoothProgress);
        targetRotationZ = THREE.MathUtils.lerp(isMobile ? 0.05 : 0.1, 0, smoothProgress);
      }

      // Apply laptop transformations with ultra-smooth damping
      if (laptopGroupRef.current) {
        // Ultra-smooth position damping with optimized rates
        laptopGroupRef.current.position.x = THREE.MathUtils.damp(
          laptopGroupRef.current.position.x, targetX, 12, delta
        );
        laptopGroupRef.current.position.y = THREE.MathUtils.damp(
          laptopGroupRef.current.position.y, targetY, 10, delta
        );
        laptopGroupRef.current.position.z = THREE.MathUtils.damp(
          laptopGroupRef.current.position.z, targetZ, 10, delta
        );
        
        // Ultra-smooth 3D rotation damping
        laptopGroupRef.current.rotation.x = THREE.MathUtils.damp(
          laptopGroupRef.current.rotation.x, targetRotationX, 8, delta
        );
        laptopGroupRef.current.rotation.y = THREE.MathUtils.damp(
          laptopGroupRef.current.rotation.y, targetRotationY, 8, delta
        );
        laptopGroupRef.current.rotation.z = THREE.MathUtils.damp(
          laptopGroupRef.current.rotation.z, targetRotationZ, 8, delta
        );
        
        // Ultra-smooth scale damping
        laptopGroupRef.current.scale.setScalar(
          THREE.MathUtils.damp(laptopGroupRef.current.scale.x, targetScale, 10, delta)
        );
        
        // Add subtle smooth vibration for ultra-realism - reduced on mobile
        const vibrationIntensity = isMobile ? 0.0005 : 0.001;
        laptopGroupRef.current.position.x += Math.sin(time * 20) * vibrationIntensity;
        laptopGroupRef.current.position.y += Math.sin(time * 17) * vibrationIntensity;
        laptopGroupRef.current.position.z += Math.sin(time * 23) * vibrationIntensity;
      }

      // Animate energy field
      if (energyFieldRef.current) {
        energyFieldRef.current.rotation.x = time * 0.1;
        energyFieldRef.current.rotation.y = time * 0.15;
        energyFieldRef.current.scale.setScalar(1 + Math.sin(time * 1.2) * 0.1);
      }

      // Simple dynamic lighting
      if (lightRigRef.current) {
        const lights = lightRigRef.current.children;
        lights.forEach((light) => {
          if (light.type === 'DirectionalLight') {
            const dirLight = light as THREE.DirectionalLight;
            // Simple color changes based on scroll
            if (t < 0.25) {
              dirLight.color.setHex(0xffffff);
            } else if (t < 0.5) {
              dirLight.color.setHex(0x6b7280);
            } else if (t < 0.75) {
              dirLight.color.setHex(0xf59e0b);
            } else {
              dirLight.color.setHex(0x7c3aed);
            }
          }
        });
      }
    } catch (error) {
      console.error('Scene animation error:', error);
    }
  });

  return (
    <>
      <Environment preset="city" background={false} />
      <Particles scrollProgress={scrollProgress} />
      
      <fog attach="fog" args={['#0a0a0a', 5, 80]} />
      
      <group ref={laptopGroupRef}>
         <Laptop3D 
           position={[0, 0, 0]} 
           rotation={[0, 0, 0]} 
           scale={2.5} 
           scrollProgress={scrollProgress} 
           index={0} 
         />
      </group>
    </>
  );
}
