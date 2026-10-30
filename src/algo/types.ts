export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type StepType =
  | 'init'
  | 'pop'
  | 'visit'
  | 'relax-check'
  | 'relax-update'
  | 'skip'
  | 'done'
  | 'path'
  | 'unreachable';

export interface DijkstraStep {
  stepIndex: number;
  type: StepType;
  currentNodeId: string | null;
  edgeBeingChecked: {
    from: string;
    to: string;
    weight: number;
  } | null;
  distSnapshot: Record<string, number>;
  prevSnapshot: Record<string, string | null>;
  visitedSnapshot: string[];
  pqSnapshot: Array<{ id: string; dist: number }>;
  activeVariables: {
    u?: string;
    v?: string;
    w?: number;
    newDist?: number;
    alt?: number;
    currentDist?: number;
  };
  codeLine: number; // 1-indexed C++ line number
  explanation: string;
  detailedWhy: string;
  improved?: boolean;
  finalPath?: string[];
  totalCost?: number;
}

export interface DijkstraExecutionResult {
  hasNegativeWeight: boolean;
  steps: DijkstraStep[];
  finalPath: string[];
  totalCost: number;
  isReachable: boolean;
}
