import React, { useState } from 'react';
import {
  Cpu,
  AlertTriangle,
  Globe2,
  Navigation,
  Network,
  Split,
  Scale,
} from 'lucide-react';

export const ComplexitySection: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<'bellman' | 'astar' | 'bfs' | 'floyd'>('bellman');

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-20 space-y-16 bg-[#FBF9F5] text-warm-espresso font-sans">
      {/* 1. Complexity Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-warm-border text-xs font-mono text-warm-sage shadow-warm-sm">
            <Cpu className="w-3.5 h-3.5" />
            <span>Asymptotic Complexity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-warm-espresso tracking-tight">
            Time & Space Complexity in C++
          </h2>
          <p className="text-warm-mocha text-sm">
            Complexity depends on the data structure chosen for the priority queue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Vector/Array */}
          <div className="p-6 rounded-2xl warm-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-warm-sand font-bold">
                std::vector (Linear Scan)
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-warm-subtle text-warm-mocha">
                Dense (E ≈ V²)
              </span>
            </div>
            <div className="font-mono text-3xl font-black text-warm-mocha">
              O(V²)
            </div>
            <p className="text-xs text-warm-mocha leading-relaxed">
              Finding the minimum tentative distance requires scanning all <code className="text-warm-espresso font-mono">V</code> vertices each round. For dense graphs with many edges, this simple array approach is often faster in practice due to contiguous cache locality.
            </p>
          </div>

          {/* Card 2: std::priority_queue (Standard) */}
          <div className="p-6 rounded-2xl warm-card border-warm-terracotta/40 shadow-warm-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-warm-terracotta font-bold">
                std::priority_queue (Binary Heap)
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FFF7ED] text-warm-amber border border-warm-amber/30">
                Standard C++ STL
              </span>
            </div>
            <div className="font-mono text-3xl font-black text-warm-terracotta">
              O((V + E) log V)
            </div>
            <p className="text-xs text-warm-espresso leading-relaxed">
              Extracting the minimum takes <code className="text-warm-terracotta font-mono">O(log V)</code> and each edge relaxation pushes an element into the heap in <code className="text-warm-terracotta font-mono">O(log V)</code>. Highly effective for sparse graphs like road networks.
            </p>
          </div>

          {/* Card 3: Fibonacci Heap */}
          <div className="p-6 rounded-2xl warm-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-warm-amber font-bold">
                Fibonacci Heap (boost::heap)
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-warm-subtle text-warm-mocha">
                Theoretical Limit
              </span>
            </div>
            <div className="font-mono text-3xl font-black text-warm-amber">
              O(E + V log V)
            </div>
            <p className="text-xs text-warm-mocha leading-relaxed">
              Amortized <code className="text-warm-espresso font-mono">O(1)</code> decrease-key operations reduce total cost. However, high constant-factor pointer chasing makes it slower than <code className="text-warm-espresso font-mono">std::priority_queue</code> for most practical inputs.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Why No Negative Weights */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF9F6] border border-warm-terracotta/30 space-y-4 shadow-warm-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-warm-terracotta/15 text-warm-terracotta border border-warm-terracotta/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-warm-espresso">
              Why Dijkstra Fails on Negative Weights
            </h3>
            <p className="text-xs text-warm-mocha font-mono">
              The Irreversible Settled Invariant
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-warm-mocha leading-relaxed">
          Dijkstra’s greedy invariant states that when a vertex <code className="text-warm-espresso font-mono">u</code> is extracted from the min-heap, its tentative distance <code className="text-warm-espresso font-mono">dist[u]</code> is final and settled. Once marked visited, it is never reconsidered.
        </p>

        <div className="p-4 rounded-xl bg-white border border-warm-border text-xs font-mono text-warm-espresso space-y-1.5 shadow-warm-sm">
          <div className="text-warm-brick font-bold">Counterexample:</div>
          <div>Suppose vertex A has edges A → B (cost 3) and A → C (cost 5).</div>
          <div>Dijkstra pops B first (cost 3) and marks B settled.</div>
          <div>If there is an edge C → B with weight -10, the true shortest route to B is A → C → B (cost 5 - 10 = -5).</div>
          <div className="text-warm-terracotta font-semibold">Because B was marked settled, Dijkstra never revisits B, returning the incorrect answer 3.</div>
        </div>
      </div>

      {/* 3. Algorithm Comparison */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-warm-terracotta" />
              <h3 className="text-xl font-bold text-warm-espresso">Algorithm Comparison</h3>
            </div>
            <p className="text-xs text-warm-mocha">
              Selecting the appropriate shortest path algorithm in C++
            </p>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white border border-warm-border text-xs shadow-warm-sm">
            <button
              onClick={() => setSelectedAlgo('bellman')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedAlgo === 'bellman'
                  ? 'bg-warm-espresso text-white shadow-warm-sm'
                  : 'text-warm-mocha hover:text-warm-espresso'
              }`}
            >
              vs Bellman-Ford
            </button>
            <button
              onClick={() => setSelectedAlgo('astar')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedAlgo === 'astar'
                  ? 'bg-warm-espresso text-white shadow-warm-sm'
                  : 'text-warm-mocha hover:text-warm-espresso'
              }`}
            >
              vs A* Search
            </button>
            <button
              onClick={() => setSelectedAlgo('bfs')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedAlgo === 'bfs'
                  ? 'bg-warm-espresso text-white shadow-warm-sm'
                  : 'text-warm-mocha hover:text-warm-espresso'
              }`}
            >
              vs BFS
            </button>
            <button
              onClick={() => setSelectedAlgo('floyd')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedAlgo === 'floyd'
                  ? 'bg-warm-espresso text-white shadow-warm-sm'
                  : 'text-warm-mocha hover:text-warm-espresso'
              }`}
            >
              vs Floyd-Warshall
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl warm-card space-y-3">
          {selectedAlgo === 'bellman' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-warm-espresso">Dijkstra vs Bellman-Ford</h4>
              <p className="text-xs text-warm-mocha leading-relaxed">
                Bellman-Ford relaxes all edges <code className="text-warm-espresso font-mono">V - 1</code> times, running in <code className="text-warm-espresso font-mono">O(V · E)</code>. It handles negative edge weights and detects negative cycles, but is asymptotically slower than Dijkstra.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1 font-mono text-xs">
                <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border">
                  <div className="text-warm-sand">Dijkstra:</div>
                  <div className="text-warm-sage font-bold">Fast: O((V+E) log V)</div>
                  <div className="text-warm-brick text-[10px]">Non-negative weights only</div>
                </div>
                <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border">
                  <div className="text-warm-sand">Bellman-Ford:</div>
                  <div className="text-warm-amber font-bold">Slower: O(V · E)</div>
                  <div className="text-warm-sage text-[10px]">Handles negative weights & cycles</div>
                </div>
              </div>
            </div>
          )}

          {selectedAlgo === 'astar' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-warm-espresso">Dijkstra vs A* Search</h4>
              <p className="text-xs text-warm-mocha leading-relaxed">
                A* augments Dijkstra with an admissible heuristic function <code className="text-warm-espresso font-mono">h(n)</code> (such as Euclidean distance). Instead of radiating equally in all directions, A* prioritizes vertices directed toward the destination.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1 font-mono text-xs">
                <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border">
                  <div className="text-warm-sand">Dijkstra:</div>
                  <div className="text-warm-espresso font-bold">Radial exploration</div>
                  <div className="text-warm-mocha text-[10px]">Finds shortest path to all nodes</div>
                </div>
                <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border">
                  <div className="text-warm-sand">A* Search:</div>
                  <div className="text-warm-sage font-bold">Target-directed heuristic</div>
                  <div className="text-warm-mocha text-[10px]">Faster for point-to-point target</div>
                </div>
              </div>
            </div>
          )}

          {selectedAlgo === 'bfs' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-warm-espresso">Dijkstra vs Breadth-First Search (BFS)</h4>
              <p className="text-xs text-warm-mocha leading-relaxed">
                BFS finds shortest paths on unweighted graphs in <code className="text-warm-espresso font-mono">O(V + E)</code> using a FIFO queue (<code className="text-warm-espresso font-mono">std::queue</code>). Dijkstra is the weighted generalization of BFS, substituting the FIFO queue with a min-priority queue.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1 font-mono text-xs">
                <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border">
                  <div className="text-warm-sand">Dijkstra:</div>
                  <div className="text-warm-espresso font-bold">Weighted (w ≥ 0)</div>
                  <div className="text-warm-mocha text-[10px]">std::priority_queue, O((V+E)log V)</div>
                </div>
                <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border">
                  <div className="text-warm-sand">BFS:</div>
                  <div className="text-warm-sage font-bold">Unweighted (all w=1)</div>
                  <div className="text-warm-mocha text-[10px]">std::queue, O(V+E)</div>
                </div>
              </div>
            </div>
          )}

          {selectedAlgo === 'floyd' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-warm-espresso">Dijkstra vs Floyd-Warshall</h4>
              <p className="text-xs text-warm-mocha leading-relaxed">
                Floyd-Warshall is a dynamic programming algorithm computing all-pairs shortest paths in <code className="text-warm-espresso font-mono">O(V³)</code>. Running Dijkstra V times with a binary heap runs in <code className="text-warm-espresso font-mono">O(V · E log V)</code>, which is faster for sparse graphs.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1 font-mono text-xs">
                <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border">
                  <div className="text-warm-sand">Repeated Dijkstra:</div>
                  <div className="text-warm-espresso font-bold">O(V · E log V)</div>
                  <div className="text-warm-mocha text-[10px]">Optimal for sparse graphs</div>
                </div>
                <div className="p-3 rounded-xl bg-warm-subtle border border-warm-border">
                  <div className="text-warm-sand">Floyd-Warshall:</div>
                  <div className="text-warm-mocha font-bold">O(V³)</div>
                  <div className="text-warm-mocha text-[10px]">3 simple nested loops</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Practical Applications */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-warm-espresso flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-warm-terracotta" />
            Everyday Engineering Applications
          </h3>
          <p className="text-xs text-warm-mocha">
            Where Dijkstra is used in systems engineering and infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl warm-card space-y-2">
            <Navigation className="w-5 h-5 text-warm-terracotta" />
            <h4 className="text-sm font-bold text-warm-espresso">Routing Engines</h4>
            <p className="text-[11px] text-warm-mocha leading-relaxed">
              Open-source C++ routing engines (like OSRM and Valhalla) use contraction hierarchies built on Dijkstra for turn-by-turn navigation.
            </p>
          </div>

          <div className="p-4 rounded-xl warm-card space-y-2">
            <Network className="w-5 h-5 text-warm-sage" />
            <h4 className="text-sm font-bold text-warm-espresso">Link-State Protocols</h4>
            <p className="text-[11px] text-warm-mocha leading-relaxed">
              OSPF (Open Shortest Path First) and IS-IS run Dijkstra in router firmware to compute optimal packet paths across Autonomous Systems.
            </p>
          </div>

          <div className="p-4 rounded-xl warm-card space-y-2">
            <Split className="w-5 h-5 text-warm-amber" />
            <h4 className="text-sm font-bold text-warm-espresso">Transit Schedules</h4>
            <p className="text-[11px] text-warm-mocha leading-relaxed">
              Timetable routing systems apply Dijkstra on time-expanded graphs to minimize passenger transfer delays.
            </p>
          </div>

          <div className="p-4 rounded-xl warm-card space-y-2">
            <Cpu className="w-5 h-5 text-warm-walnut" />
            <h4 className="text-sm font-bold text-warm-espresso">VLSI Wire Routing</h4>
            <p className="text-[11px] text-warm-mocha leading-relaxed">
              Silicon EDA tools calculate shortest copper trace paths across multi-layer printed circuit boards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
