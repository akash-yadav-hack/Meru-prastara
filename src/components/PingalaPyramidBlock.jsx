import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { soundEngine } from '../utils/soundEngine';

export function PingalaPyramidBlock({
  n,
  k,
  val,
  position,
  isSelected,
  isParent,
  isRowHighlighted,
  fibColor,
  onClick,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Smooth hover and selection lift animation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetY = isSelected ? position[1] + 0.35 : hovered ? position[1] + 0.15 : position[1];
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 12, delta);

    // Target scale
    const targetScale = isSelected ? 1.08 : hovered ? 1.04 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
  });

  // Calculate dynamic block material colors
  const { color, emissive, emissiveIntensity, metalness, roughness } = useMemo(() => {
    if (isSelected) {
      return {
        color: '#38bdf8', // radiant cyan
        emissive: '#0284c7',
        emissiveIntensity: 0.8,
        metalness: 0.85,
        roughness: 0.15,
      };
    }
    if (isParent) {
      return {
        color: '#fbbf24', // warm gold parent glow
        emissive: '#d97706',
        emissiveIntensity: 0.65,
        metalness: 0.85,
        roughness: 0.2,
      };
    }
    if (fibColor) {
      return {
        color: fibColor,
        emissive: fibColor,
        emissiveIntensity: 0.35,
        metalness: 0.6,
        roughness: 0.3,
      };
    }
    if (isRowHighlighted) {
      return {
        color: '#eab308',
        emissive: '#ca8a04',
        emissiveIntensity: 0.45,
        metalness: 0.75,
        roughness: 0.25,
      };
    }
    if (hovered) {
      return {
        color: '#fef08a',
        emissive: '#eab308',
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.2,
      };
    }
    // Default ancient sandstone with brass/gold sheen
    return {
      color: '#d4af37',
      emissive: '#451a03',
      emissiveIntensity: 0.08,
      metalness: 0.65,
      roughness: 0.35,
    };
  }, [isSelected, isParent, fibColor, isRowHighlighted, hovered]);

  // Block size: 1.15 x 0.45 x 1.15 with rounded bevel
  return (
    <group position={[position[0], position[1], position[2]]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          soundEngine.playSelectSound();
          onClick(n, k);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.18, 0.42, 1.18]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          metalness={metalness}
          roughness={roughness}
        />

        {/* Top-face value text */}
        <Text
          position={[0, 0.22, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.34}
          color={isSelected ? '#ffffff' : '#1e1b18'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor={isSelected ? '#0369a1' : '#ffffff'}
          fontWeight="bold"
        >
          {val}
        </Text>

        {/* Front-face value text */}
        <Text
          position={[0, 0, 0.60]}
          fontSize={0.24}
          color={isSelected ? '#ffffff' : '#fef9c3'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {val}
        </Text>

        {/* Coordinates label (n, k) on top rim */}
        <Text
          position={[0, 0.22, 0.42]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.11}
          color={isSelected ? '#ffffff' : '#57534e'}
          anchorX="center"
          anchorY="middle"
        >
          {`(${n},${k})`}
        </Text>
      </mesh>
    </group>
  );
}
