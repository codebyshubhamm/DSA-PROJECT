import type { GraphData, DijkstraStep, DijkstraExecutionResult } from './types';

export function runDijkstra(
  graph: GraphData,
  sourceId: string,
  targetId: string | null = null
): DijkstraExecutionResult {
  const steps: DijkstraStep[] = [];
  let stepIndex = 0;

  // 1. Check for negative weights
  const negativeEdge = graph.edges.find((e) => e.weight < 0);
  if (negativeEdge) {
    steps.push({
      stepIndex: stepIndex++,
      type: 'skip',
      currentNodeId: null,
      edgeBeingChecked: {
        from: negativeEdge.from,
        to: negativeEdge.to,
        weight: negativeEdge.weight,
      },
      distSnapshot: {},
      prevSnapshot: {},
      visitedSnapshot: [],
      pqSnapshot: [],
      activeVariables: { u: negativeEdge.from, v: negativeEdge.to, w: negativeEdge.weight },
      codeLine: 3,
      explanation: `Negative edge detected on edge ${negativeEdge.from} → ${negativeEdge.to} (${negativeEdge.weight}). Dijkstra requires non-negative edge weights.`,
      detailedWhy:
        'Dijkstra relies on the greedy invariant: once a node is popped from the min-heap, its shortest path is final. Negative weights can decrease already settled costs later. Use Bellman-Ford instead.',
    });
    return {
      hasNegativeWeight: true,
      steps,
      finalPath: [],
      totalCost: 0,
      isReachable: false,
    };
  }

  // 2. Validate source node
  const sourceNode = graph.nodes.find((n) => n.id === sourceId);
  if (!sourceNode) {
    return {
      hasNegativeWeight: false,
      steps: [],
      finalPath: [],
      totalCost: 0,
      isReachable: false,
    };
  }

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  let pq: Array<{ id: string; dist: number }> = [];

  for (const node of graph.nodes) {
    dist[node.id] = Infinity;
    prev[node.id] = null;
  }
  dist[sourceId] = 0;
  pq.push({ id: sourceId, dist: 0 });

  // Initial Step (Line 8-11: dist[src] = 0.0, pq.push({0.0, src}))
  steps.push({
    stepIndex: stepIndex++,
    type: 'init',
    currentNodeId: sourceId,
    edgeBeingChecked: null,
    distSnapshot: { ...dist },
    prevSnapshot: { ...prev },
    visitedSnapshot: Array.from(visited),
    pqSnapshot: [...pq],
    activeVariables: { u: sourceId, newDist: 0 },
    codeLine: 8,
    explanation: `Set dist[${sourceId}] = 0 and enqueued {0.0, "${sourceId}"} into priority queue. All other distances set to ∞.`,
    detailedWhy:
      'Starting cost is 0. All other vertices start at infinity until discovered.',
  });

  // Source == Target immediate shortcut check
  if (targetId && sourceId === targetId) {
    steps.push({
      stepIndex: stepIndex++,
      type: 'done',
      currentNodeId: sourceId,
      edgeBeingChecked: null,
      distSnapshot: { ...dist },
      prevSnapshot: { ...prev },
      visitedSnapshot: [sourceId],
      pqSnapshot: [],
      activeVariables: { u: sourceId },
      codeLine: 16,
      explanation: `Source node ${sourceId} is the destination. Total cost = 0.`,
      detailedWhy: 'Source and target are identical; 0 hops required.',
      finalPath: [sourceId],
      totalCost: 0,
    });
    return {
      hasNegativeWeight: false,
      steps,
      finalPath: [sourceId],
      totalCost: 0,
      isReachable: true,
    };
  }

  const getOutgoingEdges = (u: string) => {
    return graph.edges.filter((e) => e.from === u);
  };

  // Main loop
  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u, dist: d } = pq.shift()!;

    // Step: Pop min from PQ (Line 13)
    steps.push({
      stepIndex: stepIndex++,
      type: 'pop',
      currentNodeId: u,
      edgeBeingChecked: null,
      distSnapshot: { ...dist },
      prevSnapshot: { ...prev },
      visitedSnapshot: Array.from(visited),
      pqSnapshot: [...pq],
      activeVariables: { u, currentDist: d },
      codeLine: 13,
      explanation: `Extracted vertex "${u}" with minimum distance ${d} from priority queue.`,
      detailedWhy:
        `Greedy property: since edge weights are non-negative, any other frontier path to "${u}" must have cost ≥ ${d}, so ${d} is provably optimal.`,
    });

    // Step: Check if already visited (Line 14)
    if (visited.has(u)) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'skip',
        currentNodeId: u,
        edgeBeingChecked: null,
        distSnapshot: { ...dist },
        prevSnapshot: { ...prev },
        visitedSnapshot: Array.from(visited),
        pqSnapshot: [...pq],
        activeVariables: { u },
        codeLine: 14,
        explanation: `Vertex "${u}" is already settled. Skipping duplicate priority queue entry.`,
        detailedWhy:
          'A cheaper path to this node was already processed earlier. This entry is stale.',
      });
      continue;
    }

    // Step: Mark visited (Line 15)
    visited.add(u);
    steps.push({
      stepIndex: stepIndex++,
      type: 'visit',
      currentNodeId: u,
      edgeBeingChecked: null,
      distSnapshot: { ...dist },
      prevSnapshot: { ...prev },
      visitedSnapshot: Array.from(visited),
      pqSnapshot: [...pq],
      activeVariables: { u, currentDist: dist[u] },
      codeLine: 15,
      explanation: `Marked vertex "${u}" as settled with finalized distance ${dist[u]}.`,
      detailedWhy: `Vertex "${u}" added to settled set S. Shortest distance from source is guaranteed to be ${dist[u]}.`,
    });

    // Check target reached (Line 16)
    if (targetId && u === targetId) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'done',
        currentNodeId: u,
        edgeBeingChecked: null,
        distSnapshot: { ...dist },
        prevSnapshot: { ...prev },
        visitedSnapshot: Array.from(visited),
        pqSnapshot: [...pq],
        activeVariables: { u },
        codeLine: 16,
        explanation: `Reached target "${targetId}". Search finished.`,
        detailedWhy: `Destination vertex was extracted and settled. Early exit terminates the loop.`,
      });
      break;
    }

    // Relax outgoing edges (Lines 17-23)
    const outgoing = getOutgoingEdges(u);
    for (const edge of outgoing) {
      const v = edge.to;
      const w = edge.weight;
      const newDist = dist[u] + w;
      const currentTargetDist = dist[v];
      const willImprove = newDist < currentTargetDist;

      // Relax Check step (Line 20)
      steps.push({
        stepIndex: stepIndex++,
        type: 'relax-check',
        currentNodeId: u,
        edgeBeingChecked: { from: u, to: v, weight: w },
        distSnapshot: { ...dist },
        prevSnapshot: { ...prev },
        visitedSnapshot: Array.from(visited),
        pqSnapshot: [...pq],
        activeVariables: { u, v, w, newDist, currentDist: currentTargetDist },
        codeLine: 20,
        improved: willImprove,
        explanation: willImprove
          ? `Edge ${u} → ${v} (w=${w}): ${dist[u]} + ${w} = ${newDist} < ${currentTargetDist === Infinity ? '∞' : currentTargetDist}. Relaxation succeeds.`
          : `Edge ${u} → ${v} (w=${w}): ${dist[u]} + ${w} = ${newDist} ≥ ${currentTargetDist}. No update.`,
        detailedWhy: willImprove
          ? `Path to "${v}" via "${u}" improves the previous cost of ${currentTargetDist === Infinity ? '∞' : currentTargetDist} to ${newDist}.`
          : `Known route to "${v}" (${currentTargetDist}) is already shorter or equal to going via "${u}" (${newDist}).`,
      });

      if (willImprove) {
        dist[v] = newDist;
        prev[v] = u;
        pq.push({ id: v, dist: newDist });

        // Relax Update step (Line 21)
        steps.push({
          stepIndex: stepIndex++,
          type: 'relax-update',
          currentNodeId: u,
          edgeBeingChecked: { from: u, to: v, weight: w },
          distSnapshot: { ...dist },
          prevSnapshot: { ...prev },
          visitedSnapshot: Array.from(visited),
          pqSnapshot: [...pq].sort((a, b) => a.dist - b.dist),
          activeVariables: { u, v, w, newDist, currentDist: newDist },
          codeLine: 21,
          improved: true,
          explanation: `Updated dist[${v}] = ${newDist}, set prev[${v}] = ${u}, and pushed {${newDist}, "${v}"} into priority queue.`,
          detailedWhy: `Updated distance map and predecessor pointer for "${v}".`,
        });
      }
    }
  }

  // Path reconstruction
  let finalPath: string[] = [];
  let isReachable = false;
  let totalCost = 0;

  if (targetId) {
    if (dist[targetId] < Infinity) {
      isReachable = true;
      totalCost = dist[targetId];
      let curr: string | null = targetId;
      while (curr !== null) {
        finalPath.unshift(curr);
        curr = prev[curr] ?? null;
      }
    }
  } else {
    finalPath = [sourceId];
  }

  // Final Step (Line 27)
  steps.push({
    stepIndex: stepIndex++,
    type: 'path',
    currentNodeId: targetId ?? sourceId,
    edgeBeingChecked: null,
    distSnapshot: { ...dist },
    prevSnapshot: { ...prev },
    visitedSnapshot: Array.from(visited),
    pqSnapshot: [...pq],
    activeVariables: {},
    codeLine: 27,
    finalPath,
    totalCost,
    explanation: isReachable
      ? `Shortest path: ${finalPath.join(' → ')} with total cost ${totalCost}.`
      : targetId
      ? `Target "${targetId}" is unreachable from "${sourceId}".`
      : `Algorithm completed. All reachable vertices settled.`,
    detailedWhy: isReachable
      ? `Backtracked predecessor pointers prev[] from "${targetId}" back to origin "${sourceId}".`
      : 'No path exists between source and target in this graph.',
  });

  return {
    hasNegativeWeight: false,
    steps,
    finalPath,
    totalCost,
    isReachable,
  };
}
