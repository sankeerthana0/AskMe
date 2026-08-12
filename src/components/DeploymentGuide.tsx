import React from 'react';
import { Terminal, Server, Database, ShieldCheck, Zap, Layers, Cpu, Radio, HardDrive } from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              AskMe Architecture & OS Kernel Optimization Guide
            </h2>
            <p className="text-sm text-slate-400">
              Low-level Netty socket tuning, Linux kernel settings, Kafka partition keys, and Docker setup.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Technical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Netty Non-Blocking IO Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-200 font-mono flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>1. High-Performance Netty EventLoop Tuning</span>
          </h3>
          <p className="text-xs text-slate-400">
            Unlike traditional Blocking Servlet containers (Tomcat thread-per-request), Netty uses non-blocking EventLoop threads based on Linux <code className="text-amber-300">epoll</code>.
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-amber-400 font-bold block">Boss EventLoop Group (1 Thread):</span>
              <span className="text-slate-400 text-[11px]">Handles incoming TCP handshake accept requests.</span>
            </div>
            <div>
              <span className="text-amber-400 font-bold block">Worker EventLoop Group (2x CPU Cores):</span>
              <span className="text-slate-400 text-[11px]">Executes non-blocking frame read/write pipelines across thousands of persistent channels.</span>
            </div>
            <div>
              <span className="text-amber-400 font-bold block">PooledByteBufAllocator:</span>
              <span className="text-slate-400 text-[11px]">Zero-copy memory pool allocation avoiding JVM garbage collection overhead during high frame throughput.</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Redis Pub/Sub Routing Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-200 font-mono flex items-center space-x-2">
            <Zap className="w-4 h-4 text-red-400" />
            <span>2. Redis Distributed Presence & Route Hash</span>
          </h3>
          <p className="text-xs text-slate-400">
            User-to-Server route registry mapping active WebSocket connections across horizontally scaled App Servers.
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-red-400 font-bold block">Route Lookup (HSET askme:routes):</span>
              <span className="text-slate-400 text-[11px]">Key: <code className="text-slate-200">user_id</code> -&gt; Value: <code className="text-slate-200">server-2</code>. Sub-1ms O(1) route lookup.</span>
            </div>
            <div>
              <span className="text-red-400 font-bold block">Pub/Sub Broadcast Channels:</span>
              <span className="text-slate-400 text-[11px]">Server-1 publishes to <code className="text-slate-200">askme:channel:node:server-2</code> when destination client resides on Node 2.</span>
            </div>
            <div>
              <span className="text-red-400 font-bold block">Sliding Heartbeat Window:</span>
              <span className="text-slate-400 text-[11px]">Clients refresh 30-second TTL presence key on every ping frame to handle abrupt connection loss.</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Apache Kafka Decoupling */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-200 font-mono flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>3. Kafka Stream Partitioning Strategy</span>
          </h3>
          <p className="text-xs text-slate-400">
            Decouples real-time Netty socket I/O from database disk writes, ensuring 100% responsive user delivery.
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-cyan-400 font-bold block">Partition Key Strategy:</span>
              <span className="text-slate-400 text-[11px]">Messages are partitioned by <code className="text-slate-200">conversationId</code> so chat threads are processed sequentially.</span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold block">Idempotent Producer:</span>
              <span className="text-slate-400 text-[11px]"><code className="text-slate-200">enable.idempotence=true</code> prevents duplicate message creation under network retries.</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: PostgreSQL Index Optimization */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-200 font-mono flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>4. PostgreSQL Batch Insert & Indexing</span>
          </h3>
          <p className="text-xs text-slate-400">
            Batch consumer workers insert 500-record chunks from Kafka with composite indexing for instant history pagination.
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-emerald-400 font-bold block">Composite Index:</span>
              <span className="text-slate-400 text-[11px]">CREATE INDEX idx_msg_history ON messages(conversation_id, created_at DESC);</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold block">Delivery Status Table:</span>
              <span className="text-slate-400 text-[11px]">Tracks transition state from SENT -&gt; ACK_SERVER -&gt; DELIVERED -&gt; READ -&gt; PERSISTED_DB.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
