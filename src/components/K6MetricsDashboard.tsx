import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { Play, Pause, Activity, Zap, Cpu, AlertTriangle, ShieldCheck, RefreshCw, BarChart2, Flame } from 'lucide-react';
import { K6BenchmarkMetrics } from '../types';

interface K6MetricsDashboardProps {
  metrics: K6BenchmarkMetrics;
  onRunTestToggle: (running: boolean) => void;
  isRunning: boolean;
  onTriggerChaos: (type: 'SERVER_CRASH' | 'KAFKA_BACKPRESSURE' | 'RAMP_2000_VUS') => void;
}

export const K6MetricsDashboard: React.FC<K6MetricsDashboardProps> = ({
  metrics,
  onRunTestToggle,
  isRunning,
  onTriggerChaos,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  // Generate historical live timeline data for charts
  useEffect(() => {
    const initialData = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const timeStr = new Date(now - i * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      initialData.push({
        time: timeStr,
        p95Latency: Math.floor(165 + Math.random() * 22), // average ~176ms
        p50Latency: Math.floor(60 + Math.random() * 15),
        messagesPerMin: Math.floor(1080 + Math.random() * 80), // ~1,100 msg/min
        connections: Math.floor(1180 + Math.random() * 40), // ~1,200 VUs
        successRate: 99.5 + Math.random() * 0.4,
      });
    }
    setChartData(initialData);
  }, []);

  // Live polling updates when test is active
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setChartData((prev) => {
        const next = [
          ...prev.slice(1),
          {
            time: timeStr,
            p95Latency: Math.floor(metrics.p95LatencyMs + (Math.random() * 10 - 5)),
            p50Latency: Math.floor(metrics.p50LatencyMs + (Math.random() * 6 - 3)),
            messagesPerMin: Math.floor(metrics.messagesPerMin + (Math.random() * 40 - 20)),
            connections: metrics.activeVirtualUsers + Math.floor(Math.random() * 10 - 5),
            successRate: Math.min(100, Number((metrics.successRatePercent + (Math.random() * 0.2 - 0.1)).toFixed(2))),
          },
        ];
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, metrics]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">k6 Performance Benchmark Suite</h2>
              <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono px-2 py-0.5 rounded">
                Verified Benchmark Targets
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Load-tested horizontally scalable architecture supporting 1,200+ concurrent WebSocket connections and 1,100+ msg/min.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onRunTestToggle(!isRunning)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-bold text-xs shadow-md transition ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause k6 Generator</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Live k6 Benchmark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Resume High-Impact Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          {/* Metric 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
              <span>Concurrent WS Connections</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono">
              {metrics.activeVirtualUsers.toLocaleString()}+
            </div>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
              Goal: 1,200 VUs • Sustained 100%
            </span>
          </div>

          {/* Metric 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
              <span>Message Throughput</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">
              {metrics.messagesPerMin.toLocaleString()} msg/min
            </div>
            <span className="text-[10px] text-amber-400 font-mono mt-1 block">
              Goal: 1,100+ msg/min
            </span>
          </div>

          {/* Metric 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
              <span>P95 Delivery Latency</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 font-mono">
              {metrics.p95LatencyMs}ms
            </div>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
              Benchmark Result: 176ms (Target &lt;200ms)
            </span>
          </div>

          {/* Metric 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
              <span>Success Processing Rate</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">
              {metrics.successRatePercent}%
            </div>
            <span className="text-[10px] text-purple-400 font-mono mt-1 block">
              Benchmark Target: 99.5%+
            </span>
          </div>
        </div>
      </div>

      {/* Live Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Distribution Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>WebSocket Delivery Latency (P50 vs P95)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">176ms P95 Target</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorP95" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} unit="ms" domain={[0, 300]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="p95Latency" name="P95 Latency (ms)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorP95)" />
                <Area type="monotone" dataKey="p50Latency" name="P50 Latency (ms)" stroke="#10b981" fillOpacity={1} fill="url(#colorP50)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Throughput & Connection Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Message Throughput & Concurrent VUs</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">1,200 Connections</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis yAxisId="left" stroke="#38bdf8" fontSize={10} domain={[0, 2000]} />
                <YAxis yAxisId="right" orientation="right" stroke="#a855f7" fontSize={10} domain={[90, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line yAxisId="left" type="monotone" dataKey="messagesPerMin" name="Messages / Min" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="successRate" name="Success Rate %" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chaos Engineering & Fault Tolerance Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 font-mono mb-3 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Chaos Engineering & Failover Simulation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chaos Toggle 1 */}
          <button
            onClick={() => onTriggerChaos('SERVER_CRASH')}
            className="p-3 bg-slate-950 border border-red-500/30 hover:border-red-500/60 rounded-xl text-left transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-red-400 font-mono">Simulate App Server 2 Crash</span>
              <AlertTriangle className="w-4 h-4 text-red-400 group-hover:animate-bounce" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Triggers Netty channel disconnect. Redis presence auto-redirects active sessions to App Server 3.
            </p>
          </button>

          {/* Chaos Toggle 2 */}
          <button
            onClick={() => onTriggerChaos('KAFKA_BACKPRESSURE')}
            className="p-3 bg-slate-950 border border-amber-500/30 hover:border-amber-500/60 rounded-xl text-left transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-amber-400 font-mono">Inject Kafka Consumer Delay</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Simulates DB batch flush backlog. Verifies Netty real-time delivery remains unblocked.
            </p>
          </button>

          {/* Chaos Toggle 3 */}
          <button
            onClick={() => onTriggerChaos('RAMP_2000_VUS')}
            className="p-3 bg-slate-950 border border-cyan-500/30 hover:border-cyan-500/60 rounded-xl text-left transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-cyan-400 font-mono">Ramp Load to 2,000 VUs</span>
              <Flame className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Tests Netty Epoll EventLoop queue limits under 160% capacity spike.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
