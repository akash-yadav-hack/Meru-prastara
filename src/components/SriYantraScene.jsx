import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { soundEngine } from '../utils/soundEngine';

export function SriYantraScene({
  elevation = 1.0, // 0 (flat Bhu Prastara) to 1.0 (full 3D Maha Meru)
  selectedTierId,
  onSelectTier,
  tiersData,
}) {
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={[0, -1.8, 0]}>
      {/* 1. Bhupura Earth Citadel (Tier 1) */}
      <BhupuraBase
        elevation={elevation}
        isSelected={selectedTierId === 1}
        onClick={() => onSelectTier(1)}
      />

      {/* 2. Concentric Rings & 16-Petal Lotus (Tier 2) */}
      <LotusTier
        tierId={2}
        petalCount={16}
        radius={4.4}
        innerRadius={3.7}
        baseY={0.45 * elevation}
        elevation={elevation}
        isSelected={selectedTierId === 2}
        onClick={() => onSelectTier(2)}
      />

      {/* 3. 8-Petal Lotus (Tier 3) */}
      <LotusTier
        tierId={3}
        petalCount={8}
        radius={3.5}
        innerRadius={2.8}
        baseY={0.95 * elevation}
        elevation={elevation}
        isSelected={selectedTierId === 3}
        onClick={() => onSelectTier(3)}
      />

      {/* 4. Tier 4: Outer 14 Triangles (Chaturdashara) */}
      <TriangleTier
        tierId={4}
        count={14}
        radius={2.7}
        baseY={1.55 * elevation}
        height={0.55 * Math.max(0.08, elevation)}
        isSelected={selectedTierId === 4}
        onClick={() => onSelectTier(4)}
      />

      {/* 5. Tier 5: Outer 10 Triangles (Bahir Dashara) */}
      <TriangleTier
        tierId={5}
        count={10}
        radius={2.05}
        baseY={2.15 * elevation}
        height={0.55 * Math.max(0.08, elevation)}
        isSelected={selectedTierId === 5}
        onClick={() => onSelectTier(5)}
      />

      {/* 6. Tier 6: Inner 10 Triangles (Antar Dashara) */}
      <TriangleTier
        tierId={6}
        count={10}
        radius={1.45}
        baseY={2.75 * elevation}
        height={0.55 * Math.max(0.08, elevation)}
        isSelected={selectedTierId === 6}
        onClick={() => onSelectTier(6)}
      />

      {/* 7. Tier 7: Inner 8 Triangles (Ashtara) */}
      <TriangleTier
        tierId={7}
        count={8}
        radius={0.95}
        baseY={3.35 * elevation}
        height={0.55 * Math.max(0.08, elevation)}
        isSelected={selectedTierId === 7}
        onClick={() => onSelectTier(7)}
      />

      {/* 8. Tier 8: Central Inverted Triangle (Kona / Trikona) */}
      <CentralTriangle
        baseY={3.95 * elevation}
        elevation={elevation}
        isSelected={selectedTierId === 8}
        onClick={() => onSelectTier(8)}
      />

      {/* 9. Tier 9: Supreme Bindu Apex Spire */}
      <BinduApex
        baseY={4.55 * elevation}
        elevation={elevation}
        isSelected={selectedTierId === 9}
        onClick={() => onSelectTier(9)}
      />

      {/* Ground Sacred Mandala Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <ringGeometry args={[6.8, 7.8, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#78350f"
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

// 1. Bhupura: Triple-stepped square rampart with 4 T-shaped cardinal portals
function BhupuraBase({ elevation, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);

  // Stepped triple square terraces
  const tiers = [
    { size: 10.8, height: 0.16, y: 0.08 },
    { size: 9.8, height: 0.16, y: 0.24 },
    { size: 8.8, height: 0.16, y: 0.4 },
  ];

  const color = isSelected ? '#38bdf8' : hovered ? '#fef08a' : '#d4af37';
  const emissive = isSelected ? '#0284c7' : hovered ? '#ca8a04' : '#451a03';

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playSelectSound();
        onClick();
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
    >
      {tiers.map((t, idx) => (
        <mesh
          key={`bhupura-step-${idx}`}
          position={[0, t.y * Math.max(0.1, elevation), 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[t.size, t.height * Math.max(0.2, elevation), t.size]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={isSelected ? 0.6 : 0.15}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* 4 Cardinal T-Gate projections (North, South, East, West) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <group key={`gate-${i}`} rotation={[0, angle, 0]}>
          <mesh
            position={[0, 0.22 * Math.max(0.1, elevation), 5.5]}
            castShadow
          >
            <boxGeometry args={[2.2, 0.28 * Math.max(0.2, elevation), 0.65]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.7 : 0.2}
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 2 & 3: Sculpted 3D Lotus Petals Tier (16 & 8 petals)
function LotusTier({ tierId, petalCount, radius, innerRadius, baseY, elevation, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);

  // Generate petals radial arrangement
  const petals = useMemo(() => {
    const list = [];
    const angleStep = (Math.PI * 2) / petalCount;
    for (let i = 0; i < petalCount; i++) {
      const angle = i * angleStep;
      list.push({
        id: i,
        angle,
        x: Math.cos(angle) * ((radius + innerRadius) / 2),
        z: Math.sin(angle) * ((radius + innerRadius) / 2),
      });
    }
    return list;
  }, [petalCount, radius, innerRadius]);

  const color = isSelected ? '#38bdf8' : hovered ? '#fef08a' : '#d97706';
  const emissive = isSelected ? '#0284c7' : hovered ? '#b45309' : '#78350f';

  return (
    <group
      position={[0, baseY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playSelectSound();
        onClick();
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
    >
      {/* Central circular rim pedestal */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[innerRadius, innerRadius * 1.05, 0.22 * Math.max(0.1, elevation), 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.6 : 0.15}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Sculpted Petal Prisms */}
      {petals.map((p) => (
        <group key={`petal-${tierId}-${p.id}`} position={[p.x, 0.05, p.z]} rotation={[0, -p.angle + Math.PI / 2, 0]}>
          <mesh
            rotation={[0.25 * Math.max(0.2, elevation), 0, 0]}
            castShadow
          >
            <coneGeometry
              args={[
                (radius - innerRadius) * 0.45,
                (radius - innerRadius) * 1.1,
                4,
              ]}
            />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.7 : 0.25}
              metalness={0.75}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 4, 5, 6, 7: Interlocking Stepped Triangular Prisms (Shiva/Shakti Tiers)
function TriangleTier({ tierId, count, radius, baseY, height, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);

  const prisms = useMemo(() => {
    const list = [];
    const angleStep = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      list.push({
        id: i,
        angle,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        isPointingUp: i % 2 === 0, // Alternating Shiva & Shakti balance
      });
    }
    return list;
  }, [count, radius]);

  const color = isSelected ? '#38bdf8' : hovered ? '#fde047' : tierId % 2 === 0 ? '#ea580c' : '#c026d3';
  const emissive = isSelected ? '#0284c7' : hovered ? '#ca8a04' : '#4a044e';

  return (
    <group
      position={[0, baseY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playSelectSound();
        onClick();
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
    >
      {/* Supporting Polygonal Core */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[radius * 0.9, radius * 1.02, height * 0.8, count]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.6 : 0.2}
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Triangular Mountain Projections */}
      {prisms.map((p) => (
        <group key={`tri-${tierId}-${p.id}`} position={[p.x, height * 0.4, p.z]} rotation={[0, -p.angle, 0]}>
          <mesh
            rotation={[p.isPointingUp ? 0.2 : -0.2, 0, 0]}
            castShadow
          >
            <coneGeometry args={[radius * 0.22, height * 1.4, 3]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.8 : 0.3}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 8. Central Inverted Triangle (Kona / Trikona)
function CentralTriangle({ baseY, elevation, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const color = isSelected ? '#38bdf8' : hovered ? '#67e8f9' : '#06b6d4';
  const emissive = isSelected ? '#0284c7' : '#083344';

  return (
    <group
      position={[0, baseY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playSelectSound();
        onClick();
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
    >
      {/* Inverted 3D Prism pointing downward */}
      <mesh
        rotation={[Math.PI, 0, 0]}
        position={[0, 0.2 * Math.max(0.1, elevation), 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.62, 0.05, 0.45 * Math.max(0.1, elevation), 3]}
        />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

// 9. Supreme Golden Bindu Apex Point
function BinduApex({ baseY, elevation, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const sphereRef = useRef();

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 1.5;
    }
  });

  const color = isSelected ? '#38bdf8' : '#fbbf24';
  const emissive = isSelected ? '#0284c7' : '#f59e0b';

  return (
    <group
      position={[0, baseY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playSelectSound();
        onClick();
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
    >
      {/* Spire Stupa Cone */}
      <mesh position={[0, 0.2 * Math.max(0.1, elevation), 0]} castShadow>
        <coneGeometry args={[0.26, 0.55 * Math.max(0.1, elevation), 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Radiant Glowing Bindu Pearl Sphere */}
      <mesh
        ref={sphereRef}
        position={[0, 0.58 * Math.max(0.1, elevation), 0]}
        castShadow
      >
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#38ef7d"
          emissiveIntensity={0.95}
          metalness={0.9}
          roughness={0.05}
        />
      </mesh>
    </group>
  );
}
