import React from 'react';
import * as THREE from 'three';
import type { GraphNode } from '../algo/types';

interface ConnectionLine3DProps {
  fromNodeId: string;
  nodes: GraphNode[];
}

export const ConnectionLine3D: React.FC<ConnectionLine3DProps> = ({
  fromNodeId,
  nodes,
}) => {
  const fromNode = nodes.find((n) => n.id === fromNodeId);
  if (!fromNode) return null;

  return (
    <group position={[fromNode.x, fromNode.y, fromNode.z]}>
      <mesh>
        <ringGeometry args={[0.7, 0.85, 24]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};
