import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { PingalaPyramidBlock } from './PingalaPyramidBlock';
import { AdditionBeams } from './AdditionBeams';
import { nCr, getDiagonalIndex, FIB_DIAGONAL_COLORS } from '../utils/mathUtils';

export function PingalaPyramidScene({
  maxRows = 8,
  selectedCell,
  onSelectCell,
  showFibonacci,
  highlightedRow,
}) {
  // Generate block items with calculated 3D positions
  // Block spacing: width 1.3, height step 0.52, depth step 0.75
  const blockData = useMemo(() => {
    const blocks = [];
    const blockWidth = 1.32;
    const heightStep = 0.52;
    const depthStep = 0.78;

    for (let n = 0; n <= maxRows; n++) {
      const y = (maxRows - n) * heightStep;
      const z = n * depthStep - (maxRows * depthStep) / 2;
      const rowStartX = (-(n * blockWidth)) / 2;

      for (let k = 0; k <= n; k++) {
        const x = rowStartX + k * blockWidth;
        const val = nCr(n, k);
        blocks.push({
          n,
          k,
          val,
          position: [x, y, z],
          diagIndex: getDiagonalIndex(n, k),
        });
      }
    }
    return blocks;
  }, [maxRows]);

  // Find selected child position and its parents
  const { childPos, parent1Pos, parent2Pos } = useMemo(() => {
    if (!selectedCell) return { childPos: null, parent1Pos: null, parent2Pos: null };
    const { n, k } = selectedCell;
    const child = blockData.find((b) => b.n === n && b.k === k);
    if (!child) return { childPos: null, parent1Pos: null, parent2Pos: null };

    const p1 = n > 0 && k > 0 ? blockData.find((b) => b.n === n - 1 && b.k === k - 1) : null;
    const p2 = n > 0 && k < n ? blockData.find((b) => b.n === n - 1 && b.k === k) : null;

    return {
      childPos: child.position,
      parent1Pos: p1 ? p1.position : null,
      parent2Pos: p2 ? p2.position : null,
    };
  }, [selectedCell, blockData]);

  // Compute row sum labels for the horizontal tiers (Powers of 2)
  const rowLabels = useMemo(() => {
    const labels = [];
    const heightStep = 0.52;
    const depthStep = 0.78;
    for (let n = 0; n <= maxRows; n++) {
      const y = (maxRows - n) * heightStep;
      const z = n * depthStep - (maxRows * depthStep) / 2;
      const x = ((n * 1.32) / 2) + 1.2;
      labels.push({
        n,
        sum: Math.pow(2, n),
        position: [x, y, z],
      });
    }
    return labels;
  }, [maxRows]);

  // Compute Fibonacci sum badges if enabled
  const fibBadges = useMemo(() => {
    if (!showFibonacci) return [];
    // Collect diagonals
    const diagSums = {};
    const diagPositions = {};

    blockData.forEach((b) => {
      // In the shallow diagonal grouping:
      // F(m) = sum over k of C(m - k, k)
      // That means m = n + k
      const d = b.n + b.k;
      if (!diagSums[d]) {
        diagSums[d] = 0;
        diagPositions[d] = [];
      }
      diagSums[d] += b.val;
      diagPositions[d].push(b.position);
    });

    const badges = [];
    Object.keys(diagSums).forEach((dStr) => {
      const d = parseInt(dStr, 10);
      const positions = diagPositions[d];
      if (positions.length > 0) {
        // Average position of the diagonal blocks shifted to the left
        const minX = Math.min(...positions.map((p) => p[0]));
        const avgY = positions.reduce((acc, p) => acc + p[1], 0) / positions.length;
        const avgZ = positions.reduce((acc, p) => acc + p[2], 0) / positions.length;
        badges.push({
          d,
          sum: diagSums[d],
          color: FIB_DIAGONAL_COLORS[d % FIB_DIAGONAL_COLORS.length],
          position: [minX - 1.2, avgY, avgZ],
        });
      }
    });

    return badges;
  }, [showFibonacci, blockData]);

  return (
    <group position={[0, -1.5, 0]}>
      {/* 3D Stepped Blocks */}
      {blockData.map((b) => {
        const isSelected = selectedCell && selectedCell.n === b.n && selectedCell.k === b.k;
        const isParent =
          selectedCell &&
          selectedCell.n - 1 === b.n &&
          (b.k === selectedCell.k - 1 || b.k === selectedCell.k);
        const isRowHighlighted = highlightedRow !== null && highlightedRow === b.n;
        const fibColor = showFibonacci
          ? FIB_DIAGONAL_COLORS[(b.n + b.k) % FIB_DIAGONAL_COLORS.length]
          : null;

        return (
          <PingalaPyramidBlock
            key={`block-${b.n}-${b.k}`}
            n={b.n}
            k={b.k}
            val={b.val}
            position={b.position}
            isSelected={isSelected}
            isParent={isParent}
            isRowHighlighted={isRowHighlighted}
            fibColor={fibColor}
            onClick={(n, k) => onSelectCell({ n, k })}
          />
        );
      })}

      {/* Halayudha Addition Glow Beams */}
      <AdditionBeams
        parent1Pos={parent1Pos}
        parent2Pos={parent2Pos}
        childPos={childPos}
      />

      {/* Row Sum Labels (2^n) */}
      {rowLabels.map((r) => (
        <group key={`row-label-${r.n}`} position={r.position}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color={highlightedRow === r.n ? '#fbbf24' : '#334155'}
              emissive={highlightedRow === r.n ? '#f59e0b' : '#000000'}
              emissiveIntensity={highlightedRow === r.n ? 0.6 : 0}
            />
          </mesh>
          <Text
            position={[0.35, 0, 0]}
            fontSize={0.25}
            color={highlightedRow === r.n ? '#fef08a' : '#94a3b8'}
            anchorX="left"
            anchorY="middle"
            fontWeight="bold"
          >
            {`Σ = ${r.sum} (2^${r.n})`}
          </Text>
        </group>
      ))}

      {/* Fibonacci Diagonal Badges */}
      {showFibonacci &&
        fibBadges.map((badge) => (
          <group key={`fib-badge-${badge.d}`} position={badge.position}>
            <mesh>
              <sphereGeometry args={[0.26, 16, 16]} />
              <meshStandardMaterial
                color={badge.color}
                emissive={badge.color}
                emissiveIntensity={0.6}
              />
            </mesh>
            <Text
              position={[-0.38, 0, 0]}
              fontSize={0.28}
              color="#ffffff"
              anchorX="right"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
              fontWeight="bold"
            >
              {`F = ${badge.sum}`}
            </Text>
          </group>
        ))}

      {/* Base Platform / Altar */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[maxRows * 1.05 + 1.2, maxRows * 1.15 + 1.5, 0.4, 32]} />
        <meshStandardMaterial color="#111422" roughness={0.7} metalness={0.4} />
      </mesh>
    </group>
  );
}
