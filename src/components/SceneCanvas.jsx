import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { PingalaPyramidScene } from './PingalaPyramidScene';
import { SriYantraScene } from './SriYantraScene';
import { CosmicParticles } from './CosmicParticles';
import { SRI_YANTRA_TIERS } from '../data/sriYantraData';

export function SceneCanvas({
  mode, // 'pingala' | 'sri-yantra'
  autoRotate,
  cameraPreset,
  // Mode 1 props
  maxRows,
  selectedCell,
  onSelectCell,
  showFibonacci,
  highlightedRow,
  // Mode 2 props
  elevation,
  selectedTierId,
  onSelectTier,
}) {
  const controlsRef = useRef();

  // Apply Camera Presets smoothly
  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    if (cameraPreset === 'top') {
      controls.object.position.set(0, 18, 0.01);
      controls.target.set(0, 0, 0);
    } else if (cameraPreset === 'iso') {
      controls.object.position.set(12, 11, 14);
      controls.target.set(0, 0, 0);
    } else if (cameraPreset === 'front') {
      controls.object.position.set(0, 3, 16);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  }, [cameraPreset]);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <color attach="background" args={['#08090f']} />

        {/* Dynamic Camera */}
        <PerspectiveCamera
          makeDefault
          position={[11, 10, 13]}
          fov={42}
          near={0.1}
          far={100}
        />

        {/* Orbit Controls with smooth damping */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          maxDistance={35}
          minDistance={3}
          maxPolarAngle={Math.PI / 2 + 0.05} // don't go below ground
        />

        {/* Cosmic Ambient & Temple Lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          color="#fff5e6" // warm temple sun
        />
        <directionalLight
          position={[-10, 8, -10]}
          intensity={0.6}
          color="#38bdf8" // subtle cool fill
        />
        <pointLight position={[0, 6, 0]} intensity={0.8} color="#f59e0b" distance={15} />

        {/* Floating Cosmic Star Particles */}
        <CosmicParticles count={300} />

        {/* 3D Visualizer Modes */}
        {mode === 'pingala' ? (
          <PingalaPyramidScene
            maxRows={maxRows}
            selectedCell={selectedCell}
            onSelectCell={onSelectCell}
            showFibonacci={showFibonacci}
            highlightedRow={highlightedRow}
          />
        ) : (
          <SriYantraScene
            elevation={elevation}
            selectedTierId={selectedTierId}
            onSelectTier={onSelectTier}
            tiersData={SRI_YANTRA_TIERS}
          />
        )}
      </Canvas>
    </div>
  );
}
