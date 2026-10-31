import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const FloatingHeroGraph: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const nodes = [
    { pos: new THREE.Vector3(-3.5, 1.2, 0), color: '#3E271B' },
    { pos: new THREE.Vector3(-1.2, 2.5, 0.8), color: '#3B694F' },
    { pos: new THREE.Vector3(-0.8, -1.8, -0.5), color: '#B45309' },
    { pos: new THREE.Vector3(1.8, 1.6, 0.5), color: '#C25E2E' },
    { pos: new THREE.Vector3(3.2, -1.0, 0), color: '#D49A24' },
    { pos: new THREE.Vector3(0.5, 0.2, 1.2), color: '#D49A24' },
  ];

  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 5],
    [5, 4],
    [3, 4],
  ];

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.12 + pointer.x * 0.2;
      groupRef.current.rotation.x = Math.cos(t * 0.15) * 0.08 - pointer.y * 0.2;
    }

    if (pulseRef.current) {
      const p1 = nodes[0].pos;
      const p2 = nodes[2].pos;
      const p3 = nodes[5].pos;
      const p4 = nodes[4].pos;

      const cycle = (t * 0.7) % 3;
      if (cycle < 1) {
        pulseRef.current.position.lerpVectors(p1, p2, cycle);
      } else if (cycle < 2) {
        pulseRef.current.position.lerpVectors(p2, p3, cycle - 1);
      } else {
        pulseRef.current.position.lerpVectors(p3, p4, cycle - 2);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {edges.map(([fromIdx, toIdx], i) => {
        const start = nodes[fromIdx].pos;
        const end = nodes[toIdx].pos;
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        dir.normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );
        const rot = new THREE.Euler().setFromQuaternion(quat);

        return (
          <mesh key={i} position={mid} rotation={rot}>
            <cylinderGeometry args={[0.035, 0.035, len, 8]} />
            <meshStandardMaterial
              color="#D8CBC0"
              roughness={0.5}
            />
          </mesh>
        );
      })}

      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshStandardMaterial
            color={node.color}
            roughness={0.3}
            metalness={0.15}
          />
        </mesh>
      ))}

      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#C25E2E" />
      </mesh>
    </group>
  );
};

export const Hero3DScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-90">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
        <ambientLight intensity={1.1} color="#FFFBF5" />
        <directionalLight position={[6, 12, 6]} intensity={1.2} color="#FFF5EB" />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <FloatingHeroGraph />
        </Float>
      </Canvas>
    </div>
  );
};
