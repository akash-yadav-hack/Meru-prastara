import React, { useMemo } from 'react';
import * as THREE from 'three';
import { QuadraticBezierLine } from '@react-three/drei';

export function AdditionBeams({ parent1Pos, parent2Pos, childPos }) {
  if (!childPos) return null;

  // Mid control points curved upward slightly for dynamic glowing energy beam
  const control1 = useMemo(() => {
    if (!parent1Pos) return null;
    return [
      (parent1Pos[0] + childPos[0]) / 2,
      (parent1Pos[1] + childPos[1]) / 2 + 0.35,
      (parent1Pos[2] + childPos[2]) / 2 + 0.2,
    ];
  }, [parent1Pos, childPos]);

  const control2 = useMemo(() => {
    if (!parent2Pos) return null;
    return [
      (parent2Pos[0] + childPos[0]) / 2,
      (parent2Pos[1] + childPos[1]) / 2 + 0.35,
      (parent2Pos[2] + childPos[2]) / 2 + 0.2,
    ];
  }, [parent2Pos, childPos]);

  return (
    <group>
      {parent1Pos && control1 && (
        <QuadraticBezierLine
          start={[parent1Pos[0], parent1Pos[1] + 0.2, parent1Pos[2]]}
          end={[childPos[0], childPos[1] + 0.2, childPos[2]]}
          mid={control1}
          color="#38bdf8"
          lineWidth={3.5}
          dashed={false}
        />
      )}
      {parent2Pos && control2 && (
        <QuadraticBezierLine
          start={[parent2Pos[0], parent2Pos[1] + 0.2, parent2Pos[2]]}
          end={[childPos[0], childPos[1] + 0.2, childPos[2]]}
          mid={control2}
          color="#38bdf8"
          lineWidth={3.5}
          dashed={false}
        />
      )}
    </group>
  );
}
