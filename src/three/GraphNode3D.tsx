import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { useLabStore } from '../store/useLabStore';
import type { GraphNode } from '../algo/types';

interface GraphNode3DProps {
  node: GraphNode;
  onStartConnect?: (fromId: string) => void;
  onEndConnect?: (toId: string) => void;
}

export const GraphNode3D: React.FC<GraphNode3DProps> = ({
  node,
  onStartConnect,
  onEndConnect,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rippleRef = useRef<THREE.Mesh>(null);

  const {
    currentStepIndex,
    executionResult,
    sourceNodeId,
    targetNodeId,
    hoveredGraphElement,
    hoveredCodeLine,
    setHoveredGraphElement,
    setSource,
    setTarget,
    deleteNode,
    moveNode,
  } = useLabStore();

  const [isDragging, setIsDragging] = useState(false);

  const currentStep = executionResult.steps[currentStepIndex];
  const isSource = node.id === sourceNodeId;
  const isTarget = node.id === targetNodeId;

  const isCurrent = currentStep?.currentNodeId === node.id;
  const isVisited = currentStep?.visitedSnapshot?.includes(node.id) ?? false;
  const isInPQ = currentStep?.pqSnapshot?.some((item) => item.id === node.id) ?? false;
  const isOnFinalPath =
    currentStep?.type === 'path' &&
    (currentStep.finalPath?.includes(node.id) ?? false);

  const currentDist = currentStep?.distSnapshot?.[node.id] ?? Infinity;
  const distLabel = currentDist === Infinity ? '∞' : currentDist.toString();

  // Warm White & Brown Palette for nodes
  let baseColor = '#A8998D'; // Unvisited warm stone
  let emissiveColor = '#5C4A3E';
  let emissiveIntensity = 0.15;

  if (isOnFinalPath) {
    baseColor = '#D49A24'; // Warm honey gold
    emissiveColor = '#9E6C10';
    emissiveIntensity = 0.5;
  } else if (isCurrent) {
    baseColor = '#C25E2E'; // Warm terracotta
    emissiveColor = '#8A3B14';
    emissiveIntensity = 0.6;
  } else if (isVisited) {
    baseColor = '#3B694F'; // Deep sage green
    emissiveColor = '#1F3C2C';
    emissiveIntensity = 0.35;
  } else if (isInPQ) {
    baseColor = '#B45309'; // Warm amber cognac
    emissiveColor = '#6E3205';
    emissiveIntensity = 0.35;
  }

  const isHovered =
    hoveredGraphElement?.type === 'node' && hoveredGraphElement.id === node.id;
  const isCodeFocusNode =
    hoveredCodeLine !== null &&
    (isCurrent || (isHovered && [13, 15, 16, 21].includes(hoveredCodeLine)));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      if (isCurrent) {
        const s = 1 + Math.sin(t * 5) * 0.06;
        meshRef.current.scale.set(s, s, s);
      } else if (isInPQ) {
        const s = 1 + Math.sin(t * 3) * 0.03;
        meshRef.current.scale.set(s, s, s);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }

    if (rippleRef.current) {
      if (isCurrent) {
        rippleRef.current.visible = true;
        const cycle = (t * 2) % 1;
        const scale = 1 + cycle * 1.5;
        rippleRef.current.scale.set(scale, scale, scale);
        const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = (1 - cycle) * 0.5;
        }
      } else {
        rippleRef.current.visible = false;
      }
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.nativeEvent.shiftKey) {
      onStartConnect?.(node.id);
      return;
    }
    if (e.nativeEvent.button === 0) {
      setIsDragging(true);
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    }
    if (onEndConnect) {
      onEndConnect(node.id);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      e.stopPropagation();
      const p = e.point;
      moveNode(node.id, p.x, p.y, node.z);
    }
  };

  const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    deleteNode(node.id);
  };

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* Ripple ring for active node */}
      <mesh ref={rippleRef} visible={false}>
        <ringGeometry args={[0.7, 0.82, 32]} />
        <meshBasicMaterial
          color="#C25E2E"
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Main Node Sphere */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onContextMenu={handleContextMenu}
        onClick={(e) => {
          e.stopPropagation();
          if (e.altKey) {
            setTarget(node.id);
          } else {
            setSource(node.id);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredGraphElement({ type: 'node', id: node.id });
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredGraphElement(null);
        }}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={isHovered || isCodeFocusNode ? emissiveIntensity * 1.5 : emissiveIntensity}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Subtle focus wireframe */}
      {(isHovered || isCodeFocusNode) && (
        <mesh>
          <sphereGeometry args={[0.75, 24, 24]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={0.35}
            wireframe
          />
        </mesh>
      )}

      {/* Node Letter */}
      <Billboard position={[0, 0, 0.6]}>
        <Text
          fontSize={0.36}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {node.label}
        </Text>
      </Billboard>

      {/* Floating Distance Pill */}
      <Billboard position={[0, 0.95, 0]}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[0.62, 0.3]} />
          <meshBasicMaterial
            color={
              isOnFinalPath
                ? '#54360B'
                : isCurrent
                ? '#4D1D09'
                : isVisited
                ? '#193325'
                : isInPQ
                ? '#542603'
                : '#4A3B32'
            }
            transparent
            opacity={0.92}
          />
        </mesh>
        <Text
          fontSize={0.2}
          color={
            isOnFinalPath
              ? '#FDE047'
              : isCurrent
              ? '#FFD6C4'
              : isVisited
              ? '#A7F3D0'
              : isInPQ
              ? '#FDE68A'
              : '#E2D9D2'
          }
          anchorX="center"
          anchorY="middle"
        >
          {distLabel}
        </Text>
      </Billboard>

      {/* Source & Target Badges */}
      {(isSource || isTarget) && (
        <Billboard position={[0, -0.85, 0]}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[0.48, 0.24]} />
            <meshBasicMaterial
              color={isSource ? '#C25E2E' : '#28170D'}
              transparent
              opacity={0.95}
            />
          </mesh>
          <Text
            fontSize={0.15}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {isSource ? 'SRC' : 'TGT'}
          </Text>
        </Billboard>
      )}
    </group>
  );
};
