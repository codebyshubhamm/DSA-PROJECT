import React, { useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useLabStore } from '../store/useLabStore';
import type { GraphEdge, GraphNode } from '../algo/types';
import { GraphNode3D } from './GraphNode3D';
import { GraphEdge3D } from './GraphEdge3D';
import { ConnectionLine3D } from './ConnectionLine3D';
import { StarfieldGrid } from './StarfieldGrid';
import {
  RotateCcw,
  Plus,
  Compass,
  AlertTriangle,
  Layers,
} from 'lucide-react';

export const GraphCanvas: React.FC = () => {
  const {
    graph,
    cameraMode,
    executionResult,
    setCameraMode,
    addNode,
    addEdge,
    editEdgeWeight,
    loadPreset,
    activePreset,
  } = useLabStore();

  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [edgeWeightPrompt, setEdgeWeightPrompt] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [promptWeightInput, setPromptWeightInput] = useState('3');

  const orbitControlsRef = useRef<any>(null);

  const handlePlaneDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const p = e.point;
      addNode(p.x, p.y, 0);
    },
    [addNode]
  );

  const resetCamera = useCallback(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  }, []);

  const handleStartConnect = (fromId: string) => {
    setConnectingFromId(fromId);
  };

  const handleEndConnect = (toId: string) => {
    if (connectingFromId && connectingFromId !== toId) {
      setEdgeWeightPrompt({ from: connectingFromId, to: toId });
    }
    setConnectingFromId(null);
  };

  const confirmAddEdge = () => {
    if (edgeWeightPrompt) {
      const weight = parseFloat(promptWeightInput);
      addEdge(edgeWeightPrompt.from, edgeWeightPrompt.to, isNaN(weight) ? 1 : weight);
      setEdgeWeightPrompt(null);
      setPromptWeightInput('3');
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-[#FAF7F2] select-none overflow-hidden rounded-2xl border border-warm-border shadow-warm-md">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 14], fov: 45 }}
      >
        <color attach="background" args={['#FAF7F2']} />
        <ambientLight intensity={1.1} color="#FFFBF5" />
        <directionalLight position={[10, 15, 10]} intensity={1.4} color="#FFF8F0" />
        <pointLight position={[-8, -8, 6]} intensity={0.6} color="#E8DFD5" />

        {cameraMode === '3d' ? (
          <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={45} />
        ) : (
          <OrthographicCamera makeDefault position={[0, 0, 14]} zoom={40} />
        )}

        <OrbitControls
          ref={orbitControlsRef}
          enableDamping
          dampingFactor={0.06}
          maxDistance={35}
          minDistance={4}
          enableRotate={cameraMode === '3d'}
        />

        <StarfieldGrid />

        <mesh
          position={[0, 0, -0.05]}
          onDoubleClick={handlePlaneDoubleClick}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {graph.edges.map((edge: GraphEdge) => (
          <GraphEdge3D
            key={edge.id}
            edge={edge}
            nodes={graph.nodes}
            onEditWeight={(id, w) => editEdgeWeight(id, w)}
          />
        ))}

        {graph.nodes.map((node: GraphNode) => (
          <GraphNode3D
            key={node.id}
            node={node}
            onStartConnect={handleStartConnect}
            onEndConnect={handleEndConnect}
          />
        ))}

        {connectingFromId && (
          <ConnectionLine3D fromNodeId={connectingFromId} nodes={graph.nodes} />
        )}

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.5}
            intensity={0.25}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Floating Toolbar in White & Brown */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        {/* Preset Selector */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-warm-border shadow-warm-sm text-xs text-warm-espresso font-sans">
          <Layers className="w-3.5 h-3.5 text-warm-mocha ml-1.5" />
          <button
            onClick={() => loadPreset('textbook')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              activePreset === 'textbook'
                ? 'bg-warm-terracotta text-white shadow-sm'
                : 'hover:bg-warm-subtle text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            Classic
          </button>
          <button
            onClick={() => loadPreset('diamond')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              activePreset === 'diamond'
                ? 'bg-warm-terracotta text-white shadow-sm'
                : 'hover:bg-warm-subtle text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            Diamond
          </button>
          <button
            onClick={() => loadPreset('city')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              activePreset === 'city'
                ? 'bg-warm-terracotta text-white shadow-sm'
                : 'hover:bg-warm-subtle text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            City Grid
          </button>
          <button
            onClick={() => loadPreset('random')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              activePreset === 'random'
                ? 'bg-warm-terracotta text-white shadow-sm'
                : 'hover:bg-warm-subtle text-warm-mocha hover:text-warm-espresso'
            }`}
          >
            Random
          </button>
        </div>

        {/* Camera & Quick Node Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-warm-border shadow-warm-sm text-xs text-warm-espresso font-sans">
          <button
            onClick={() => setCameraMode(cameraMode === '3d' ? '2d' : '3d')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition ${
              cameraMode === '2d'
                ? 'bg-warm-walnut text-white'
                : 'hover:bg-warm-subtle text-warm-mocha hover:text-warm-espresso'
            }`}
            title="Toggle between 3D Perspective and 2D Top-Down View"
          >
            <Compass className="w-3.5 h-3.5 text-warm-terracotta" />
            {cameraMode.toUpperCase()}
          </button>

          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg hover:bg-warm-subtle text-warm-mocha hover:text-warm-espresso transition"
            title="Reset Camera Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => addNode((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, 0)}
            className="px-2.5 py-1 rounded-lg bg-warm-subtle hover:bg-warm-latte text-warm-espresso border border-warm-border flex items-center gap-1 transition font-medium"
            title="Add a new node"
          >
            <Plus className="w-3 h-3 text-warm-terracotta" />
            Node
          </button>
        </div>
      </div>

      {/* Negative Weight Alert Toast */}
      {executionResult.hasNegativeWeight && (
        <div className="absolute top-16 left-3 right-3 p-3 rounded-xl bg-[#FFF3F2] border border-warm-brick/30 text-warm-brick text-xs flex items-center justify-between shadow-warm-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warm-brick shrink-0" />
            <span>
              <strong>Negative weight detected:</strong> Dijkstra cannot guarantee shortest paths when edges are negative because settled nodes cannot be revisited.
            </span>
          </div>
        </div>
      )}

      {/* Interactive Legend at Bottom Left */}
      <div className="absolute bottom-3 left-3 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-warm-border text-[11px] font-mono text-warm-mocha flex flex-wrap gap-x-3 gap-y-1 items-center pointer-events-none shadow-warm-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8C7E74] inline-block" /> Unvisited
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warm-amber inline-block" /> In Heap
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warm-terracotta inline-block" /> Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warm-sage inline-block" /> Settled
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warm-honey inline-block" /> Shortest Path
        </span>
        <span className="text-warm-sand hidden sm:inline">|</span>
        <span className="text-warm-sand hidden sm:inline">
          Double-click empty = Add Node • Shift+drag = Connect
        </span>
      </div>

      {/* Edge Weight Modal */}
      {edgeWeightPrompt && (
        <div className="absolute inset-0 bg-[#28170D]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-80 p-5 rounded-2xl bg-white border border-warm-border shadow-warm-lg space-y-4">
            <h3 className="text-sm font-bold text-warm-espresso flex items-center justify-between">
              <span>Connect Edge</span>
              <span className="font-mono text-xs text-warm-terracotta">
                {edgeWeightPrompt.from} → {edgeWeightPrompt.to}
              </span>
            </h3>
            <div>
              <label className="block text-xs text-warm-mocha mb-1 font-medium">
                Traversal Weight:
              </label>
              <input
                type="number"
                min="0"
                max="999"
                value={promptWeightInput}
                onChange={(e) => setPromptWeightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmAddEdge();
                  if (e.key === 'Escape') setEdgeWeightPrompt(null);
                }}
                className="w-full px-3 py-2 rounded-lg bg-warm-subtle border border-warm-border text-warm-espresso font-mono text-sm focus:border-warm-terracotta outline-none"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEdgeWeightPrompt(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-warm-mocha hover:text-warm-espresso transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddEdge}
                className="px-4 py-1.5 rounded-lg text-xs bg-warm-terracotta hover:bg-[#A84E24] text-white font-semibold transition"
              >
                Add Edge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
