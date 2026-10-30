import type { GraphData, GraphNode, GraphEdge } from './types';

export const PRESET_CLASSIC_TEXTBOOK: GraphData = {
  nodes: [
    { id: 'A', label: 'A', x: -5, y: 0, z: 0 },
    { id: 'B', label: 'B', x: -2, y: 2.5, z: 0 },
    { id: 'C', label: 'C', x: -2, y: -2.5, z: 0 },
    { id: 'D', label: 'D', x: 2, y: 2.5, z: 0 },
    { id: 'E', label: 'E', x: 2, y: -2.5, z: 0 },
    { id: 'F', label: 'F', x: 5, y: 0, z: 0 },
  ],
  edges: [
    { id: 'e_ab', from: 'A', to: 'B', weight: 4 },
    { id: 'e_ac', from: 'A', to: 'C', weight: 2 },
    { id: 'e_bc', from: 'B', to: 'C', weight: 1 },
    { id: 'e_bd', from: 'B', to: 'D', weight: 5 },
    { id: 'e_cd', from: 'C', to: 'D', weight: 8 },
    { id: 'e_ce', from: 'C', to: 'E', weight: 10 },
    { id: 'e_de', from: 'D', to: 'E', weight: 2 },
    { id: 'e_df', from: 'D', to: 'F', weight: 6 },
    { id: 'e_ef', from: 'E', to: 'F', weight: 3 },
  ],
};

export const PRESET_SMALL_DIAMOND: GraphData = {
  nodes: [
    { id: 'S', label: 'S', x: -4, y: 0, z: 0 },
    { id: 'A', label: 'A', x: 0, y: 2, z: 0 },
    { id: 'B', label: 'B', x: 0, y: -2, z: 0 },
    { id: 'T', label: 'T', x: 4, y: 0, z: 0 },
  ],
  edges: [
    { id: 'e_sa', from: 'S', to: 'A', weight: 3 },
    { id: 'e_sb', from: 'S', to: 'B', weight: 6 },
    { id: 'e_ab', from: 'A', to: 'B', weight: 1 },
    { id: 'e_at', from: 'A', to: 'T', weight: 7 },
    { id: 'e_bt', from: 'B', to: 'T', weight: 2 },
  ],
};

export const PRESET_CITY_GRID: GraphData = {
  nodes: [
    { id: 'N1', label: '1st & Ave A', x: -4, y: 3, z: 0 },
    { id: 'N2', label: '1st & Ave B', x: 0, y: 3, z: 0 },
    { id: 'N3', label: '1st & Ave C', x: 4, y: 3, z: 0 },
    { id: 'N4', label: '2nd & Ave A', x: -4, y: 0, z: 0 },
    { id: 'N5', label: '2nd & Ave B', x: 0, y: 0, z: 0 },
    { id: 'N6', label: '2nd & Ave C', x: 4, y: 0, z: 0 },
    { id: 'N7', label: '3rd & Ave A', x: -4, y: -3, z: 0 },
    { id: 'N8', label: '3rd & Ave B', x: 0, y: -3, z: 0 },
    { id: 'N9', label: '3rd & Ave C', x: 4, y: -3, z: 0 },
  ],
  edges: [
    { id: 'e_12', from: 'N1', to: 'N2', weight: 2 },
    { id: 'e_23', from: 'N2', to: 'N3', weight: 3 },
    { id: 'e_45', from: 'N4', to: 'N5', weight: 4 },
    { id: 'e_56', from: 'N5', to: 'N6', weight: 1 },
    { id: 'e_78', from: 'N7', to: 'N8', weight: 3 },
    { id: 'e_89', from: 'N8', to: 'N9', weight: 2 },
    { id: 'e_14', from: 'N1', to: 'N4', weight: 5 },
    { id: 'e_47', from: 'N4', to: 'N7', weight: 2 },
    { id: 'e_25', from: 'N2', to: 'N5', weight: 2 },
    { id: 'e_58', from: 'N5', to: 'N8', weight: 3 },
    { id: 'e_36', from: 'N3', to: 'N6', weight: 4 },
    { id: 'e_69', from: 'N6', to: 'N9', weight: 1 },
    { id: 'e_26', from: 'N2', to: 'N6', weight: 5 },
    { id: 'e_48', from: 'N4', to: 'N8', weight: 4 },
  ],
};

export function generateRandomGraph(nodeCount: number = 7, density: number = 0.4): GraphData {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const count = Math.max(3, Math.min(nodeCount, 12));
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const radius = 4.5;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.8;
    const y = Math.sin(angle) * radius * 0.8 + (Math.random() - 0.5) * 0.8;
    const z = (Math.random() - 0.5) * 1.5;
    nodes.push({
      id: letters[i],
      label: letters[i],
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      z: Math.round(z * 10) / 10,
    });
  }

  let edgeIdCounter = 1;
  for (let i = 0; i < count - 1; i++) {
    const w = Math.floor(Math.random() * 8) + 1;
    edges.push({
      id: `e_rnd_${edgeIdCounter++}`,
      from: nodes[i].id,
      to: nodes[i + 1].id,
      weight: w,
    });
  }

  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      if (i !== j && Math.random() < density * 0.45) {
        const u = nodes[i].id;
        const v = nodes[j].id;
        if (!edges.some((e) => e.from === u && e.to === v)) {
          const w = Math.floor(Math.random() * 9) + 1;
          edges.push({
            id: `e_rnd_${edgeIdCounter++}`,
            from: u,
            to: v,
            weight: w,
          });
        }
      }
    }
  }

  return { nodes, edges };
}
