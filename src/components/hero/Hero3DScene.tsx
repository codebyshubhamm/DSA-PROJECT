import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const FloatingHeroGraph: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const nodes = [
    { pos: new THREE.Vector3(-3.5, 1.2, 0), color: '#38bdf8' },
    { pos: new THREE.Vector3(-1.2, 2.5, 0.8), color: '#10b981' },
    { pos: new THREE.Vector3(-0.8, -1.8, -0.5), color: '#38bdf8' },
    { pos: new THREE.Vector3(1.8, 1.6, 0.5), color: '#fbbf24' },
    { pos: new THREE.Vector3(3.2, -1.0, 0), color: '#fbbf24' },
    { pos: new THREE.Vector3(0.5, 0.2, 1.2), color: '#fbbf24' },
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
      // Gentle floating rotation + mouse parallax
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.15 + pointer.x * 0.25;
      groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.1 - pointer.y * 0.25;
    }

    if (pulseRef.current) {
      // Pulse travelling from node 0 to 2 to 5 to 4
      const p1 = nodes[0].pos;
      const p2 = nodes[2].pos;
      const p3 = nodes[5].pos;
      const p4 = nodes[4].pos;

      const cycle = (t * 0.8) % 3;
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
      {/* Edges */}
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
            <cylinderGeometry args={[0.04, 0.04, len, 8]} />
            <meshStandardMaterial
              color="#2f8cd0"
              emissive="#2f8cd0"
              emissiveIntensity={0.4}
              transparent
              opacity={0.65}
            />
          </mesh>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Photon pulse travelling along path */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
    </group>
  );
};

export const Hero3DScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-85">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <FloatingHeroGraph />
        </Float>
      </Canvas>
    </div>
  );
};
