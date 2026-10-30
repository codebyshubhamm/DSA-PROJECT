import { describe, it, expect } from 'vitest';
import { runDijkstra } from './dijkstra';
import type { GraphData } from './types';

describe('Dijkstra Algorithm Engine', () => {
  it('solves classic textbook shortest path correctly', () => {
    const graph: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0, z: 0 },
        { id: 'B', label: 'B', x: 2, y: 1, z: 0 },
        { id: 'C', label: 'C', x: 2, y: -1, z: 0 },
        { id: 'D', label: 'D', x: 5, y: 0, z: 0 },
      ],
      edges: [
        { id: 'e1', from: 'A', to: 'B', weight: 4 },
        { id: 'e2', from: 'A', to: 'C', weight: 2 },
        { id: 'e3', from: 'C', to: 'B', weight: 1 },
        { id: 'e4', from: 'B', to: 'D', weight: 5 },
        { id: 'e5', from: 'C', to: 'D', weight: 8 },
      ],
    };

    const result = runDijkstra(graph, 'A', 'D');
    expect(result.hasNegativeWeight).toBe(false);
    expect(result.isReachable).toBe(true);
    expect(result.finalPath).toEqual(['A', 'C', 'B', 'D']);
    expect(result.totalCost).toBe(8);
    expect(result.steps.length).toBeGreaterThan(5);
  });

  it('handles source equal to target', () => {
    const graph: GraphData = {
      nodes: [{ id: 'A', label: 'A', x: 0, y: 0, z: 0 }],
      edges: [],
    };

    const result = runDijkstra(graph, 'A', 'A');
    expect(result.isReachable).toBe(true);
    expect(result.finalPath).toEqual(['A']);
    expect(result.totalCost).toBe(0);
  });

  it('handles disconnected target (unreachable)', () => {
    const graph: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0, z: 0 },
        { id: 'B', label: 'B', x: 2, y: 0, z: 0 },
        { id: 'Z', label: 'Z', x: 10, y: 0, z: 0 },
      ],
      edges: [{ id: 'e1', from: 'A', to: 'B', weight: 3 }],
    };

    const result = runDijkstra(graph, 'A', 'Z');
    expect(result.isReachable).toBe(false);
    expect(result.finalPath).toEqual([]);
  });

  it('handles ties in priority queue correctly', () => {
    const graph: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0, z: 0 },
        { id: 'B1', label: 'B1', x: 2, y: 1, z: 0 },
        { id: 'B2', label: 'B2', x: 2, y: -1, z: 0 },
        { id: 'T', label: 'T', x: 4, y: 0, z: 0 },
      ],
      edges: [
        { id: 'e1', from: 'A', to: 'B1', weight: 5 },
        { id: 'e2', from: 'A', to: 'B2', weight: 5 },
        { id: 'e3', from: 'B1', to: 'T', weight: 2 },
        { id: 'e4', from: 'B2', to: 'T', weight: 2 },
      ],
    };

    const result = runDijkstra(graph, 'A', 'T');
    expect(result.isReachable).toBe(true);
    expect(result.totalCost).toBe(7);
    expect(
      ['A', 'B1', 'T'].join() === result.finalPath.join() ||
        ['A', 'B2', 'T'].join() === result.finalPath.join()
    ).toBe(true);
  });

  it('handles parallel edges by preferring the minimum weight edge', () => {
    const graph: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0, z: 0 },
        { id: 'B', label: 'B', x: 3, y: 0, z: 0 },
      ],
      edges: [
        { id: 'e1', from: 'A', to: 'B', weight: 10 },
        { id: 'e2', from: 'A', to: 'B', weight: 3 },
      ],
    };

    const result = runDijkstra(graph, 'A', 'B');
    expect(result.isReachable).toBe(true);
    expect(result.totalCost).toBe(3);
    expect(result.finalPath).toEqual(['A', 'B']);
  });

  it('guards against negative edge weights', () => {
    const graph: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0, z: 0 },
        { id: 'B', label: 'B', x: 2, y: 0, z: 0 },
      ],
      edges: [{ id: 'e1', from: 'A', to: 'B', weight: -5 }],
    };

    const result = runDijkstra(graph, 'A', 'B');
    expect(result.hasNegativeWeight).toBe(true);
    expect(result.steps.length).toBe(1);
    expect(result.steps[0].explanation).toContain('Negative edge detected');
  });
});
