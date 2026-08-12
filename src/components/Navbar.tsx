import React from 'react';
import { Server, Cpu, Activity, ShieldCheck, Code2, MessageSquare, LineChart, Terminal, CpuIcon, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeClusterNodes: number;
  totalMessagesSent: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeClusterNodes,
  totalMessagesSent,
}) => {
  const tabs = [
    { id: 'architecture', label: 'System Topology', icon: Layers },
    { id: 'chat-sandbox', label: 'Multi-Node Chat', icon: MessageSquare },
    { id: 'k6-benchmark', label: 'k6 Metrics & Load', icon: LineChart },
    { id: 'code-repo', label: 'Java & Netty Source', icon: Code2 },
    { id: 'deployment', label: 'Docker & Config', icon: Terminal },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-orange-200 to-slate-100 bg-clip-text text-transparent">
                  AskMe Platform
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Java + Netty
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Distributed Messaging • Redis Routing • Kafka Event Bus
              </p>
            </div>
          </div>

          {/* Live Cluster Metrics Header Status */}
          <div className="hidden lg:flex items-center space-x-6 text-xs font-mono bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400">Cluster Status:</span>
              <span className="text-emerald-400 font-bold">{activeClusterNodes}/3 Netty Nodes</span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Messages:</span>
              <span className="text-amber-300 font-bold">{totalMessagesSent.toLocaleString()}</span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">P95 Latency:</span>
              <span className="text-cyan-300 font-bold">176ms</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
