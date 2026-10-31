import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { useLabStore } from '../store/useLabStore';
import type { GraphEdge, GraphNode } from '../algo/types';

interface GraphEdge3DProps {
  edge: GraphEdge;
  nodes: GraphNode[];
  onEditWeight?: (edgeId: string, currentWeight: number) => void;
}

export const GraphEdge3D: React.FC<GraphEdge3DProps> = ({
  edge,
  nodes,
  onEditWeight,
}) => {
  const particleRef = useRef<THREE.Mesh>(null);

  const {
    currentStepIndex,
    executionResult,
    hoveredGraphElement,
    hoveredCodeLine,
    setHoveredGraphElement,
    deleteEdge,
  } = useLabStore();

  const currentStep = executionResult.steps[currentStepIndex];

  const fromNode = nodes.find((n) => n.id === edge.from);
  const toNode = nodes.find((n) => n.id === edge.to);

  if (!fromNode || !toNode) return null;

  const startVec = useMemo(
    () => new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z),
    [fromNode.x, fromNode.y, fromNode.z]
  );
  const endVec = useMemo(
    () => new THREE.Vector3(toNode.x, toNode.y, toNode.z),
    [toNode.x, toNode.y, toNode.z]
  );

  const midPoint = useMemo(() => {
    return new THREE.Vector3()
      .addVectors(startVec, endVec)
      .multiplyScalar(0.5);
  }, [startVec, endVec]);

  const { length, rotation, arrowPos } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(endVec, startVec);
    const len = dir.length();
    dir.normalize();

    const arrow = new THREE.Vector3()
      .copy(endVec)
      .sub(new THREE.Vector3().copy(dir).multiplyScalar(0.75));

    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    const rot = new THREE.Euler().setFromQuaternion(quat);

    return { length: len, rotation: rot, arrowPos: arrow };
  }, [startVec, endVec]);

  const isBeingChecked =
    currentStep?.edgeBeingChecked?.from === edge.from &&
    currentStep?.edgeBeingChecked?.to === edge.to;

  const willImprove = isBeingChecked && currentStep?.improved;

  const isFinalPath = useMemo(() => {
    if (currentStep?.type !== 'path' || !currentStep.finalPath) return false;
    const path = currentStep.finalPath;
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === edge.from && path[i + 1] === edge.to) return true;
    }
    return false;
  }, [currentStep, edge.from, edge.to]);

  const isHovered =
    hoveredGraphElement?.type === 'edge' && hoveredGraphElement.id === edge.id;
  const isCodeFocusEdge =
    hoveredCodeLine !== null &&
    (isBeingChecked || ([17, 18, 19, 20, 21].includes(hoveredCodeLine) && isBeingChecked));

  // Warm theme edge colors
  let edgeColor = '#A8998D'; // Soft warm clay
  let edgeRadius = 0.035;
  let emissiveIntensity = 0.1;

  if (isFinalPath) {
    edgeColor = '#D49A24'; // Warm honey gold
    edgeRadius = 0.075;
    emissiveIntensity = 0.5;
  } else if (isBeingChecked) {
    if (willImprove) {
      edgeColor = '#C25E2E'; // Terracotta
      edgeRadius = 0.065;
      emissiveIntensity = 0.6;
    } else {
      edgeColor = '#B91C1C'; // Brick red
      edgeRadius = 0.055;
      emissiveIntensity = 0.5;
    }
  } else if (isHovered || isCodeFocusEdge) {
    edgeColor = '#3E271B'; // Rich walnut
    edgeRadius = 0.05;
    emissiveIntensity = 0.3;
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (particleRef.current) {
      if (isBeingChecked || isFinalPath) {
        particleRef.current.visible = true;
        const speed = isFinalPath ? 1.5 : 2.5;
        const progress = (t * speed) % 1;
        particleRef.current.position.lerpVectors(startVec, endVec, progress);
      } else {
        particleRef.current.visible = false;
      }
    }
  });

  const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    deleteEdge(edge.id);
  };

  return (
    <group>
      {/* Edge Cylinder */}
      <mesh
        position={midPoint}
        rotation={rotation}
        onContextMenu={handleContextMenu}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredGraphElement({ type: 'edge', id: edge.id });
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredGraphElement(null);
        }}
      >
        <cylinderGeometry args={[edgeRadius, edgeRadius, length, 12]} />
        <meshStandardMaterial
          color={edgeColor}
          emissive={edgeColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Arrow Cone */}
      <mesh position={arrowPos} rotation={rotation}>
        <coneGeometry args={[0.14, 0.32, 12]} />
        <meshStandardMaterial
          color={edgeColor}
          emissive={edgeColor}
          emissiveIntensity={emissiveIntensity * 1.2}
        />
      </mesh>

      {/* Energy Particle */}
      <mesh ref={particleRef} visible={false}>
        <sphereGeometry args={[isFinalPath ? 0.12 : 0.14, 16, 16]} />
        <meshBasicMaterial
          color={isFinalPath ? '#D49A24' : willImprove ? '#C25E2E' : '#B91C1C'}
        />
      </mesh>

      {/* Weight Badge in Warm Card Aesthetic */}
      <Billboard
        position={[midPoint.x, midPoint.y + 0.32, midPoint.z]}
        onClick={(e) => {
          e.stopPropagation();
          const newW = prompt('Enter new edge weight:', edge.weight.toString());
          if (newW !== null) {
            const parsed = parseFloat(newW);
            if (!isNaN(parsed) && parsed >= 0) {
              onEditWeight?.(edge.id, parsed);
            }
          }
        }}
        onContextMenu={handleContextMenu}
      >
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.44, 0.32]} />
          <meshBasicMaterial
            color={
              isFinalPath
                ? '#FAF0DC'
                : isBeingChecked
                ? willImprove
                  ? '#FFECE3'
                  : '#FEE2E2'
                : '#FFFFFF'
            }
          />
        </mesh>
        <Text
          fontSize={0.22}
          color={
            isFinalPath
              ? '#B45309'
              : isBeingChecked
              ? willImprove
                ? '#C25E2E'
                : '#B91C1C'
              : '#28170D'
          }
          anchorX="center"
          anchorY="middle"
        >
          {edge.weight.toString()}
        </Text>
      </Billboard>
    </group>
  );
};
