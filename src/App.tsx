import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { MultiNodeChat } from './components/MultiNodeChat';
import { K6MetricsDashboard } from './components/K6MetricsDashboard';
import { JavaCodeBrowser } from './components/JavaCodeBrowser';
import { DeploymentGuide } from './components/DeploymentGuide';
import { ServerNode, ClientUser, ChatMessage, RouteTraceHop, K6BenchmarkMetrics } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('architecture');

  // App Servers Cluster State
  const [servers, setServers] = useState<ServerNode[]>([
    {
      id: 'server-1',
      name: 'Netty Node 1',
      port: 8081,
      status: 'ONLINE',
      activeConnections: 412,
      cpuUsage: 14,
      memoryUsageMB: 184,
      nettyThreadCount: 16,
      messagesProcessedCount: 48920,
    },
    {
      id: 'server-2',
      name: 'Netty Node 2',
      port: 8082,
      status: 'ONLINE',
      activeConnections: 405,
      cpuUsage: 12,
      memoryUsageMB: 178,
      nettyThreadCount: 16,
      messagesProcessedCount: 45110,
    },
    {
      id: 'server-3',
      name: 'Netty Node 3',
      port: 8083,
      status: 'ONLINE',
      activeConnections: 388,
      cpuUsage: 11,
      memoryUsageMB: 169,
      nettyThreadCount: 16,
      messagesProcessedCount: 42380,
    },
  ]);

  // Client Users State
  const [users, setUsers] = useState<ClientUser[]>([
    {
      id: 'alice',
      name: 'Alice',
      avatar: 'A',
      role: 'Staff Engineer',
      appServerId: 'server-1',
      status: 'ONLINE',
      unreadCount: 0,
    },
    {
      id: 'bob',
      name: 'Bob',
      avatar: 'B',
      role: 'Backend Developer',
      appServerId: 'server-2',
      status: 'ONLINE',
      unreadCount: 0,
    },
    {
      id: 'charlie',
      name: 'Charlie',
      avatar: 'C',
      role: 'DevOps Specialist',
      appServerId: 'server-3',
      status: 'ONLINE',
      unreadCount: 0,
    },
  ]);

  // Message History State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-101',
      senderId: 'alice',
      recipientId: 'bob',
      content: 'Hey Bob! Are you connected to Netty Node 2?',
      timestamp: '02:30:12',
      status: 'PERSISTED_DB',
      originServerId: 'server-1',
      targetServerId: 'server-2',
      trace: [
        { component: 'Client', details: 'Client Alice emits TextWebSocketFrame', timestamp: '02:30:12.001', latencyMs: 12 },
        { component: 'Netty App Server', details: 'Node 1 receives frame & returns ACK_SERVER', timestamp: '02:30:12.013', latencyMs: 2 },
        { component: 'Redis Routing', details: 'Redis HGET user:routes -> Bob is on server-2', timestamp: '02:30:12.015', latencyMs: 4 },
        { component: 'Netty App Server', details: 'Redis PUBLISH -> Node 2 pushes WS frame to Bob', timestamp: '02:30:12.021', latencyMs: 10 },
        { component: 'Kafka Queue', details: 'Kafka Producer pushes payload to topic askme-chat-messages', timestamp: '02:30:12.031', latencyMs: 8 },
        { component: 'PostgreSQL DB', details: 'Batch consumer flushes message to database', timestamp: '02:30:12.176', latencyMs: 140 },
      ],
    },
    {
      id: 'msg-102',
      senderId: 'bob',
      recipientId: 'alice',
      content: 'Yes! Received via Redis Pub/Sub channel askme:channel:node:server-2 in under 20ms!',
      timestamp: '02:30:45',
      status: 'PERSISTED_DB',
      originServerId: 'server-2',
      targetServerId: 'server-1',
      trace: [
        { component: 'Client', details: 'Client Bob emits TextWebSocketFrame', timestamp: '02:30:45.002', latencyMs: 10 },
        { component: 'Netty App Server', details: 'Node 2 receives frame & emits ACK_SERVER', timestamp: '02:30:45.012', latencyMs: 2 },
        { component: 'Redis Routing', details: 'Redis HGET user:routes -> Alice is on server-1', timestamp: '02:30:45.014', latencyMs: 3 },
        { component: 'Netty App Server', details: 'Redis PUBLISH -> Node 1 pushes frame to Alice', timestamp: '02:30:45.020', latencyMs: 9 },
        { component: 'Kafka Queue', details: 'Kafka producer enqueues message event', timestamp: '02:30:45.029', latencyMs: 7 },
        { component: 'PostgreSQL DB', details: 'Batch worker saves to DB', timestamp: '02:30:45.170', latencyMs: 139 },
      ],
    },
  ]);

  const [lastTrace, setLastTrace] = useState<RouteTraceHop[] | null>(messages[0].trace);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // k6 Metrics State
  const [k6Metrics, setK6Metrics] = useState<K6BenchmarkMetrics>({
    concurrentConnections: 1205,
    messagesPerMin: 1120,
    p50LatencyMs: 64,
    p90LatencyMs: 135,
    p95LatencyMs: 176,
    p99LatencyMs: 194,
    successRatePercent: 99.52,
    kafkaLagMessages: 4,
    redisMemoryUsageMB: 48,
    activeVirtualUsers: 1205,
  });

  const [isK6Running, setIsK6Running] = useState<boolean>(true);

  // Background ticker simulating live background message counts
  useEffect(() => {
    if (!isK6Running) return;

    const interval = setInterval(() => {
      setServers((prev) =>
        prev.map((s) => ({
          ...s,
          messagesProcessedCount: s.messagesProcessedCount + Math.floor(Math.random() * 5 + 1),
          cpuUsage: Math.min(95, Math.max(8, s.cpuUsage + Math.floor(Math.random() * 5 - 2))),
        }))
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isK6Running]);

  // Handle packet simulation trigger
  const handleTriggerPacket = (senderServerId: string, targetServerId: string) => {
    setIsSimulating(true);

    const senderUser = users.find((u) => u.appServerId === senderServerId) || users[0];
    const targetUser = users.find((u) => u.appServerId === targetServerId) || users[1];

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newTrace: RouteTraceHop[] = [
      { component: 'Client', details: `Client ${senderUser.name} emits WS frame`, timestamp: `${timeStr}.001`, latencyMs: 11 },
      { component: 'Netty App Server', details: `${senderServerId} parses frame & returns ACK_SERVER`, timestamp: `${timeStr}.012`, latencyMs: 3 },
      { component: 'Redis Routing', details: `HGET askme:routes:${targetUser.id} -> ${targetServerId}`, timestamp: `${timeStr}.015`, latencyMs: 4 },
      { component: 'Netty App Server', details: `PUBLISH askme:channel:node:${targetServerId} -> Push to WS`, timestamp: `${timeStr}.021`, latencyMs: 12 },
      { component: 'Kafka Queue', details: `Kafka producer publishes payload to partition key ${senderUser.id}_${targetUser.id}`, timestamp: `${timeStr}.033`, latencyMs: 9 },
      { component: 'PostgreSQL DB', details: `Kafka batch listener inserts into table messages`, timestamp: `${timeStr}.176`, latencyMs: 137 },
    ];

    setTimeout(() => {
      setLastTrace(newTrace);
      setIsSimulating(false);

      // Increment counters
      setServers((prev) =>
        prev.map((s) => (s.id === senderServerId ? { ...s, messagesProcessedCount: s.messagesProcessedCount + 1 } : s))
      );
    }, 1200);
  };

  // Handle sending a live chat message in MultiNodeChat
  const handleSendMessage = (senderId: string, recipientId: string, content: string) => {
    const sender = users.find((u) => u.id === senderId) || users[0];
    const recipient = users.find((u) => u.id === recipientId) || users[1];

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const msgId = `msg-${Date.now()}`;

    const trace: RouteTraceHop[] = [
      { component: 'Client', details: `Client ${sender.name} sends frame to Netty`, timestamp: `${timeStr}.001`, latencyMs: 10 },
      { component: 'Netty App Server', details: `Netty ${sender.appServerId} acknowledges frame`, timestamp: `${timeStr}.011`, latencyMs: 2 },
      { component: 'Redis Routing', details: `Redis Pub/Sub routes to ${recipient.appServerId}`, timestamp: `${timeStr}.013`, latencyMs: 4 },
      { component: 'Netty App Server', details: `Netty ${recipient.appServerId} delivers frame to ${recipient.name}`, timestamp: `${timeStr}.022`, latencyMs: 11 },
      { component: 'Kafka Queue', details: `Enqueued in topic askme-chat-messages`, timestamp: `${timeStr}.033`, latencyMs: 8 },
      { component: 'PostgreSQL DB', details: `Persisted in database`, timestamp: `${timeStr}.176`, latencyMs: 141 },
    ];

    const newMsg: ChatMessage = {
      id: msgId,
      senderId,
      recipientId,
      content,
      timestamp: timeStr,
      status: 'SENT',
      originServerId: sender.appServerId,
      targetServerId: recipient.appServerId,
      trace,
    };

    setMessages((prev) => [...prev, newMsg]);
    setLastTrace(trace);

    // Simulate progressive status transitions: SENT -> ACK_SERVER -> DELIVERED -> READ -> PERSISTED_DB
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, status: 'ACK_SERVER' } : m)));
    }, 100);

    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, status: 'DELIVERED' } : m)));
    }, 400);

    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, status: 'PERSISTED_DB' } : m)));
    }, 1200);
  };

  const handleMarkRead = (messageId: string) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: 'READ' } : m)));
  };

  // Chaos Testing Handler
  const handleTriggerChaos = (type: 'SERVER_CRASH' | 'KAFKA_BACKPRESSURE' | 'RAMP_2000_VUS') => {
    if (type === 'SERVER_CRASH') {
      setServers((prev) =>
        prev.map((s) => (s.id === 'server-2' ? { ...s, status: 'OFFLINE', activeConnections: 0 } : s))
      );
      // Auto-reconnect clients to server-3 after 4 seconds
      setTimeout(() => {
        setServers((prev) =>
          prev.map((s) =>
            s.id === 'server-2'
              ? { ...s, status: 'ONLINE', activeConnections: 410 }
              : s.id === 'server-3'
              ? { ...s, activeConnections: s.activeConnections + 200 }
              : s
          )
        );
      }, 4000);
    } else if (type === 'KAFKA_BACKPRESSURE') {
      setK6Metrics((prev) => ({
        ...prev,
        kafkaLagMessages: 480,
        p95LatencyMs: 188,
      }));
      setTimeout(() => {
        setK6Metrics((prev) => ({ ...prev, kafkaLagMessages: 6, p95LatencyMs: 176 }));
      }, 3500);
    } else if (type === 'RAMP_2000_VUS') {
      setK6Metrics((prev) => ({
        ...prev,
        activeVirtualUsers: 2050,
        messagesPerMin: 1840,
        p95LatencyMs: 182,
      }));
    }
  };

  const activeClusterNodes = servers.filter((s) => s.status === 'ONLINE').length;
  const totalMessagesSent = servers.reduce((acc, s) => acc + s.messagesProcessedCount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeClusterNodes={activeClusterNodes}
        totalMessagesSent={totalMessagesSent}
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'architecture' && (
          <ArchitectureVisualizer
            servers={servers}
            onTriggerPacket={handleTriggerPacket}
            lastTrace={lastTrace}
            isSimulating={isSimulating}
          />
        )}

        {activeTab === 'chat-sandbox' && (
          <MultiNodeChat
            messages={messages}
            users={users}
            onSendMessage={handleSendMessage}
            onMarkRead={handleMarkRead}
          />
        )}

        {activeTab === 'k6-benchmark' && (
          <K6MetricsDashboard
            metrics={k6Metrics}
            onRunTestToggle={setIsK6Running}
            isRunning={isK6Running}
            onTriggerChaos={handleTriggerChaos}
          />
        )}

        {activeTab === 'code-repo' && <JavaCodeBrowser />}

        {activeTab === 'deployment' && <DeploymentGuide />}
      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-300 font-bold">AskMe Distributed Messaging Engine</span>
            <span>• Java, Netty, Redis, Kafka, PostgreSQL</span>
          </div>
          <div className="text-slate-500">
            1,200+ Concurrent WebSockets • 1,100+ msg/min • 176ms P95 Latency
          </div>
        </div>
      </footer>
    </div>
  );
}
