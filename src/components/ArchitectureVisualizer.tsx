import React, { useState } from 'react';
import { Server, Database, Cpu, Zap, ArrowRight, Play, RefreshCw, CheckCircle2, AlertTriangle, Layers, Radio, Network } from 'lucide-react';
import { ServerNode, RouteTraceHop } from '../types';

interface ArchitectureVisualizerProps {
  servers: ServerNode[];
  onTriggerPacket: (senderServer: string, targetServer: string) => void;
  lastTrace: RouteTraceHop[] | null;
  isSimulating: boolean;
}

export const ArchitectureVisualizer: React.FC<ArchitectureVisualizerProps> = ({
  servers,
  onTriggerPacket,
  lastTrace,
  isSimulating,
}) => {
  const [selectedSource, setSelectedSource] = useState('server-1');
  const [selectedTarget, setSelectedTarget] = useState('server-2');
  const [activeTab, setActiveTab] = useState<'topology' | 'sequence'>('topology');

  const handleSimulate = () => {
    onTriggerPacket(selectedSource, selectedTarget);
  };

  return (
    <div className="space-y-6">
      {/* Visual Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">Distributed System Topology</h2>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                3 Netty Nodes + Redis Routing + Kafka
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Visualize cross-server WebSocket packet dispatching, Redis location routing, and async Kafka-PostgreSQL persistence.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('topology')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'topology' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Interactive Map
              </button>
              <button
                onClick={() => setActiveTab('sequence')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'sequence' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sequence Diagram
              </button>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-md transition disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Packet...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simulate Cross-Node Route</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Source & Target Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <label className="text-xs font-mono text-slate-400 block mb-1">Source Client Node</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="server-1">Alice (Connected to Netty Node 1)</option>
              <option value="server-2">Bob (Connected to Netty Node 2)</option>
              <option value="server-3">Charlie (Connected to Netty Node 3)</option>
            </select>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <label className="text-xs font-mono text-slate-400 block mb-1">Target Recipient Node</label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="server-2">Bob (Connected to Netty Node 2)</option>
              <option value="server-3">Charlie (Connected to Netty Node 3)</option>
              <option value="server-1">Alice (Connected to Netty Node 1)</option>
            </select>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 block">System Mode</span>
              <span className="text-xs font-bold text-emerald-400">Non-Blocking I/O (Epoll)</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block">Redis Pub/Sub</span>
              <span className="text-xs font-bold text-cyan-400">Low-latency Routing</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'topology' ? (
        /* Architecture Node Diagram */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Client Layers & Netty Servers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-amber-400" />
                Netty WebSockets Layer
              </h3>
              <span className="text-xs text-slate-500 font-mono">Port 8081 - 8083</span>
            </div>

            {servers.map((server) => {
              const isSource = selectedSource === server.id;
              const isTarget = selectedTarget === server.id;

              return (
                <div
                  key={server.id}
                  className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                    server.status === 'OFFLINE'
                      ? 'bg-red-950/20 border-red-900/50 opacity-60'
                      : isSource
                      ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : isTarget
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isSource ? 'bg-amber-500/20 text-amber-400' : isTarget ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-300'}`}>
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-100">{server.name}</h4>
                          <span className="text-xs font-mono text-slate-400">:{server.port}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          {server.activeConnections} WS Connections
                        </p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded-full border ${
                      server.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {server.status}
                    </span>
                  </div>

                  {/* Netty Server Internal Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500 block">CPU Usage:</span>
                      <span className="text-slate-200 font-semibold">{server.cpuUsage}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">EventLoops:</span>
                      <span className="text-slate-200 font-semibold">{server.nettyThreadCount} Threads</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Memory:</span>
                      <span className="text-slate-200 font-semibold">{server.memoryUsageMB} MB Heap</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Processed:</span>
                      <span className="text-amber-400 font-semibold">{server.messagesProcessedCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Middleware Layer (Redis Routing & Kafka Bus) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" />
                Inter-Server Routing & Messaging
              </h3>
              <span className="text-xs text-slate-500 font-mono">In-Memory / Stream</span>
            </div>

            {/* Redis Pub/Sub Card */}
            <div className="bg-slate-900 border border-red-500/30 p-4 rounded-xl shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">Redis Pub/Sub & Route Store</h4>
                    <p className="text-xs text-slate-400 font-mono">HSET user:routes • Channel: askme:channel:node:*</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Sub-5ms
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                Maintains live mapping of user connection IDs to target Netty servers. Broadcasts real-time frames cross-server with zero polling.
              </p>
            </div>

            {/* Kafka Cluster Card */}
            <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">Apache Kafka Cluster</h4>
                    <p className="text-xs text-slate-400 font-mono">Topic: askme-chat-messages • 3 Partitions</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Async Queue
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                Decouples Netty WebSocket delivery from slow database I/O. Messages are partitioned by <code className="text-amber-300">conversationId</code> for ordered delivery.
              </p>
            </div>
          </div>

          {/* Column 3: Persistence Layer & Step Trace */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Persistent Storage & Trace
              </h3>
              <span className="text-xs text-slate-500 font-mono">PostgreSQL 16</span>
            </div>

            {/* PostgreSQL Database Card */}
            <div className="bg-slate-900 border border-cyan-500/30 p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">PostgreSQL History Store</h4>
                    <p className="text-xs text-slate-400 font-mono">Tables: messages, users, status_tracking</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Batch Save
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                Kafka consumers batch-insert messages in 500-record chunks. Indexed by <code className="text-cyan-300">(recipient_id, created_at)</code> for sub-millisecond retrieval.
              </p>
            </div>

            {/* Packet Trace Hop Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase mb-3 flex items-center justify-between">
                <span>Packet Route Telemetry</span>
                {lastTrace && (
                  <span className="text-amber-400 text-[10px]">
                    Total: {lastTrace.reduce((acc, h) => acc + h.latencyMs, 0)}ms
                  </span>
                )}
              </h4>

              {lastTrace ? (
                <div className="space-y-2 font-mono text-xs max-h-60 overflow-y-auto pr-1">
                  {lastTrace.map((hop, idx) => (
                    <div key={idx} className="bg-slate-900 p-2 rounded border border-slate-800 flex items-start space-x-2">
                      <span className="text-amber-400 font-bold text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded">
                        Step {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{hop.component}</span>
                          <span className="text-cyan-400 text-[10px]">+{hop.latencyMs}ms</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{hop.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-mono italic text-center py-6">
                  Click "Simulate Cross-Node Route" above to watch a packet move across Netty, Redis, Kafka, and Postgres.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Sequence Diagram view */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-xs overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>Netty Cross-Server Message Sequence Protocol</span>
          </h3>

          <div className="space-y-3 min-w-[700px]">
            <div className="grid grid-cols-5 text-center font-bold text-slate-300 border-b border-slate-800 pb-2 text-[11px]">
              <div>Client A (Server 1)</div>
              <div>Netty Server 1</div>
              <div>Redis Pub/Sub</div>
              <div>Netty Server 2</div>
              <div>Kafka & Postgres</div>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-amber-300">
                <span>1. WS Frame TextWebSocketFrame("Hello Bob")</span>
                <span className="text-slate-500 text-[10px]">Client -&gt; Netty 1 [12ms]</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>2. Netty Handler emits ACK_SERVER frame back to Client A</span>
                <span className="text-slate-500 text-[10px]">Netty 1 -&gt; Client A [2ms]</span>
              </div>
              <div className="flex items-center justify-between text-red-300">
                <span>3. Redis HGET user:routes -&gt; Target is Server 2</span>
                <span className="text-slate-500 text-[10px]">Netty 1 -&gt; Redis [4ms]</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300">
                <span>4. Redis PUBLISH askme:channel:node:server-2</span>
                <span className="text-slate-500 text-[10px]">Redis -&gt; Netty 2 [6ms]</span>
              </div>
              <div className="flex items-center justify-between text-emerald-300">
                <span>5. Netty Server 2 lookup local WS channel and push frame to Client B</span>
                <span className="text-slate-500 text-[10px]">Netty 2 -&gt; Client B [10ms]</span>
              </div>
              <div className="flex items-center justify-between text-purple-300">
                <span>6. Parallel: Kafka Producer sends record to topic 'askme-chat-messages'</span>
                <span className="text-slate-500 text-[10px]">Netty 1 -&gt; Kafka -&gt; Postgres [Async]</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
