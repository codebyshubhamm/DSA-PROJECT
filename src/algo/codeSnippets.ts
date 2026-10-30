export interface CodeLineInfo {
  lineNumber: number;
  code: string;
  explanation: string;
  variableHints?: string[];
  graphFocus?: 'outgoing-edges' | 'target-edge' | 'current-node' | 'target-node' | 'all-visited' | 'path';
}

export const CPP_CODE_LINES: CodeLineInfo[] = [
  { lineNumber: 1, code: 'struct Result { vector<string> path; double cost; };', explanation: 'Result container holding the shortest path sequence and total traversal cost.' },
  { lineNumber: 2, code: '', explanation: '' },
  { lineNumber: 3, code: 'Result dijkstra(const Graph& g, const string& src, const string& tgt) {', explanation: 'Dijkstra shortest path algorithm in C++ using std::priority_queue.' },
  { lineNumber: 4, code: '    unordered_map<string, double> dist;', explanation: 'Hash table storing minimum known distance from source to each vertex.' },
  { lineNumber: 5, code: '    unordered_map<string, string> prev;', explanation: 'Predecessor map to trace backwards for path reconstruction.' },
  { lineNumber: 6, code: '    unordered_set<string> visited;', explanation: 'Settled set S. Once inserted here, a vertex distance is permanently minimal.' },
  { lineNumber: 7, code: '    for (const auto& n : g.nodes) dist[n.id] = INF;', explanation: 'Initialize all tentative vertex distances to infinity (INF).' },
  { lineNumber: 8, code: '    dist[src] = 0.0;', explanation: 'Distance from source to itself is 0.0.' },
  { lineNumber: 9, code: '    using Pair = pair<double, string>; // {cost, node_id}', explanation: 'Min-heap element type comparing primarily by cost.' },
  { lineNumber: 10, code: '    priority_queue<Pair, vector<Pair>, greater<Pair>> pq;', explanation: 'Min-priority queue (STL greater comparator extracts lowest cost first).' },
  { lineNumber: 11, code: '    pq.push({0.0, src});', explanation: 'Seed the priority queue with starting vertex (cost 0.0, src).' },
  { lineNumber: 12, code: '    while (!pq.empty()) {', explanation: 'Process frontier vertices until priority queue is empty.' },
  { lineNumber: 13, code: '        auto [d, u] = pq.top(); pq.pop();', explanation: 'Extract vertex u with smallest tentative distance d from min-heap.', graphFocus: 'current-node', variableHints: ['u', 'd'] },
  { lineNumber: 14, code: '        if (visited.count(u)) continue;', explanation: 'Skip stale priority queue entry if vertex u has already been finalized.' },
  { lineNumber: 15, code: '        visited.insert(u);', explanation: 'Mark u as settled. Greedy invariant guarantees dist[u] is optimal.', graphFocus: 'current-node', variableHints: ['u'] },
  { lineNumber: 16, code: '        if (u == tgt) break;', explanation: 'Target vertex reached! Shortest path search terminates early.', graphFocus: 'target-node' },
  { lineNumber: 17, code: '        for (const auto& edge : g.edges_from(u)) {', explanation: 'Inspect all outgoing directed edges from settled vertex u.', graphFocus: 'outgoing-edges', variableHints: ['u'] },
  { lineNumber: 18, code: '            string v = edge.to; double w = edge.weight;', explanation: 'Extract adjacent neighbor v and edge traversal cost w.', variableHints: ['u', 'v', 'w'] },
  { lineNumber: 19, code: '            double new_dist = dist[u] + w;', explanation: 'Compute candidate route distance to v passing through u.', variableHints: ['u', 'v', 'w', 'newDist'] },
  { lineNumber: 20, code: '            if (new_dist < dist[v]) {', explanation: 'Relaxation condition: does going via u yield a strictly cheaper path?', graphFocus: 'target-edge', variableHints: ['newDist', 'v'] },
  { lineNumber: 21, code: '                dist[v] = new_dist;', explanation: 'Path improved! Update dist[v] to new minimum cost.', graphFocus: 'target-node', variableHints: ['v', 'newDist'] },
  { lineNumber: 22, code: '                prev[v] = u;', explanation: 'Record u as the parent predecessor of v.', variableHints: ['v', 'u'] },
  { lineNumber: 23, code: '                pq.push({new_dist, v});', explanation: 'Push improved cost pair into min-heap frontier.', variableHints: ['v', 'newDist'] },
  { lineNumber: 24, code: '            }', explanation: 'End relaxation conditional.' },
  { lineNumber: 25, code: '        }', explanation: 'End neighbor scan.' },
  { lineNumber: 26, code: '    }', explanation: 'End priority queue processing loop.' },
  { lineNumber: 27, code: '    return reconstruct_path(prev, src, tgt);', explanation: 'Backtrack predecessor links from destination to origin to build final path.', graphFocus: 'path' },
  { lineNumber: 28, code: '}', explanation: 'End function.' },
];
