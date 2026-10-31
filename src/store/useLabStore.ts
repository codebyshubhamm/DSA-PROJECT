import { create } from 'zustand';
import type { GraphData, DijkstraExecutionResult } from '../algo/types';
import { runDijkstra } from '../algo/dijkstra';
import {
  PRESET_CLASSIC_TEXTBOOK,
  PRESET_SMALL_DIAMOND,
  PRESET_CITY_GRID,
  generateRandomGraph,
} from '../algo/presets';

export type PresetKey = 'textbook' | 'diamond' | 'city' | 'random';
export type ActiveTab = 'code' | 'state' | 'explain';
export type CameraMode = '3d' | '2d';

export interface HoveredGraphElement {
  type: 'node' | 'edge';
  id: string;
}

interface LabState {
  graph: GraphData;
  sourceNodeId: string;
  targetNodeId: string;
  activePreset: PresetKey;

  executionResult: DijkstraExecutionResult;
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  autoPlayOnChange: boolean;

  activeTab: ActiveTab;
  hoveredCodeLine: number | null;
  hoveredGraphElement: HoveredGraphElement | null;
  cameraMode: CameraMode;
  beginnerMode: boolean;

  recomputeSteps: () => void;
  setGraph: (graph: GraphData) => void;
  setSource: (id: string) => void;
  setTarget: (id: string) => void;
  addNode: (x: number, y: number, z: number, label?: string) => void;
  moveNode: (id: string, x: number, y: number, z: number) => void;
  deleteNode: (id: string) => void;
  addEdge: (from: string, to: string, weight: number) => void;
  editEdgeWeight: (id: string, weight: number) => void;
  deleteEdge: (id: string) => void;
  loadPreset: (key: PresetKey) => void;
  generateRandom: (count?: number, density?: number) => void;

  setCurrentStepIndex: (index: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToStart: () => void;
  jumpToEnd: () => void;
  jumpToStepWhereLine: (targetLine: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setAutoPlayOnChange: (autoPlay: boolean) => void;

  setActiveTab: (tab: ActiveTab) => void;
  setHoveredCodeLine: (line: number | null) => void;
  setHoveredGraphElement: (elem: HoveredGraphElement | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleBeginnerMode: () => void;
}

const initialGraph = PRESET_CLASSIC_TEXTBOOK;
const initialSource = 'A';
const initialTarget = 'F';
const initialResult = runDijkstra(initialGraph, initialSource, initialTarget);

export const useLabStore = create<LabState>((set, get) => ({
  graph: initialGraph,
  sourceNodeId: initialSource,
  targetNodeId: initialTarget,
  activePreset: 'textbook',
  executionResult: initialResult,
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  autoPlayOnChange: false,
  activeTab: 'code',
  hoveredCodeLine: null,
  hoveredGraphElement: null,
  cameraMode: '3d',
  beginnerMode: false,

  recomputeSteps: () => {
    const { graph, sourceNodeId, targetNodeId } = get();
    const result = runDijkstra(graph, sourceNodeId, targetNodeId);
    set({
      executionResult: result,
      currentStepIndex: 0,
      isPlaying: get().autoPlayOnChange,
    });
  },

  setGraph: (graph) => {
    set({ graph });
    get().recomputeSteps();
  },

  setSource: (id) => {
    if (id === get().sourceNodeId) return;
    set({ sourceNodeId: id });
    get().recomputeSteps();
  },

  setTarget: (id) => {
    if (id === get().targetNodeId) return;
    set({ targetNodeId: id });
    get().recomputeSteps();
  },

  addNode: (x, y, z, customLabel) => {
    const { graph } = get();
    const usedLabels = new Set(graph.nodes.map((n) => n.label));
    let nextLabel = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const char of alphabet) {
      if (!usedLabels.has(char)) {
        nextLabel = char;
        break;
      }
    }
    if (!nextLabel) {
      nextLabel = `N${graph.nodes.length + 1}`;
    }
    const label = customLabel ?? nextLabel;
    const newNode = {
      id: label,
      label,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      z: Math.round(z * 10) / 10,
    };
    const newGraph = {
      ...graph,
      nodes: [...graph.nodes, newNode],
    };
    set({ graph: newGraph });
    get().recomputeSteps();
  },

  moveNode: (id, x, y, z) => {
    const { graph } = get();
    const newNodes = graph.nodes.map((n) =>
      n.id === id ? { ...n, x, y, z } : n
    );
    set({ graph: { ...graph, nodes: newNodes } });
  },

  deleteNode: (id) => {
    const { graph, sourceNodeId, targetNodeId } = get();
    const newNodes = graph.nodes.filter((n) => n.id !== id);
    const newEdges = graph.edges.filter((e) => e.from !== id && e.to !== id);
    const newSource = sourceNodeId === id && newNodes.length > 0 ? newNodes[0].id : sourceNodeId;
    const newTarget = targetNodeId === id && newNodes.length > 1 ? newNodes[1].id : targetNodeId;

    set({
      graph: { nodes: newNodes, edges: newEdges },
      sourceNodeId: newSource,
      targetNodeId: newTarget,
    });
    get().recomputeSteps();
  },

  addEdge: (from, to, weight) => {
    const { graph } = get();
    if (from === to) return;
    const exists = graph.edges.find((e) => e.from === from && e.to === to);
    if (exists) {
      get().editEdgeWeight(exists.id, weight);
      return;
    }
    const newEdge = {
      id: `e_${from}_${to}_${Date.now()}`,
      from,
      to,
      weight: Math.max(0, weight),
    };
    set({
      graph: {
        ...graph,
        edges: [...graph.edges, newEdge],
      },
    });
    get().recomputeSteps();
  },

  editEdgeWeight: (id, weight) => {
    const { graph } = get();
    const newEdges = graph.edges.map((e) =>
      e.id === id ? { ...e, weight } : e
    );
    set({ graph: { ...graph, edges: newEdges } });
    get().recomputeSteps();
  },

  deleteEdge: (id) => {
    const { graph } = get();
    set({
      graph: {
        ...graph,
        edges: graph.edges.filter((e) => e.id !== id),
      },
    });
    get().recomputeSteps();
  },

  loadPreset: (key) => {
    let graph = PRESET_CLASSIC_TEXTBOOK;
    let src = 'A';
    let tgt = 'F';

    if (key === 'diamond') {
      graph = PRESET_SMALL_DIAMOND;
      src = 'S';
      tgt = 'T';
    } else if (key === 'city') {
      graph = PRESET_CITY_GRID;
      src = 'N1';
      tgt = 'N9';
    } else if (key === 'random') {
      graph = generateRandomGraph(7, 0.45);
      src = graph.nodes[0]?.id ?? 'A';
      tgt = graph.nodes[graph.nodes.length - 1]?.id ?? 'G';
    }

    set({
      graph,
      sourceNodeId: src,
      targetNodeId: tgt,
      activePreset: key,
    });
    get().recomputeSteps();
  },

  generateRandom: (count = 7, density = 0.45) => {
    const graph = generateRandomGraph(count, density);
    const src = graph.nodes[0]?.id ?? 'A';
    const tgt = graph.nodes[graph.nodes.length - 1]?.id ?? 'G';
    set({
      graph,
      sourceNodeId: src,
      targetNodeId: tgt,
      activePreset: 'random',
    });
    get().recomputeSteps();
  },

  setCurrentStepIndex: (index) => {
    const { executionResult } = get();
    const clamped = Math.max(0, Math.min(index, executionResult.steps.length - 1));
    set({ currentStepIndex: clamped });
  },

  stepForward: () => {
    const { currentStepIndex, executionResult } = get();
    if (currentStepIndex < executionResult.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  jumpToStart: () => {
    set({ currentStepIndex: 0, isPlaying: false });
  },

  jumpToEnd: () => {
    const { executionResult } = get();
    set({ currentStepIndex: executionResult.steps.length - 1, isPlaying: false });
  },

  jumpToStepWhereLine: (targetLine) => {
    const { executionResult, currentStepIndex } = get();
    const steps = executionResult.steps;
    for (let i = currentStepIndex + 1; i < steps.length; i++) {
      if (steps[i].codeLine === targetLine) {
        set({ currentStepIndex: i });
        return;
      }
    }
    for (let i = 0; i <= currentStepIndex; i++) {
      if (steps[i].codeLine === targetLine) {
        set({ currentStepIndex: i });
        return;
      }
    }
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setAutoPlayOnChange: (autoPlay) => set({ autoPlayOnChange: autoPlay }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setHoveredCodeLine: (line) => set({ hoveredCodeLine: line }),
  setHoveredGraphElement: (elem) => set({ hoveredGraphElement: elem }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleBeginnerMode: () => set((state) => ({ beginnerMode: !state.beginnerMode })),
}));
