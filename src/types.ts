export type DeliveryStatus = 'SENT' | 'ACK_SERVER' | 'DELIVERED' | 'READ' | 'PERSISTED_DB';

export interface ServerNode {
  id: string;
  name: string;
  port: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  activeConnections: number;
  cpuUsage: number;
  memoryUsageMB: number;
  nettyThreadCount: number;
  messagesProcessedCount: number;
}

export interface ClientUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
  appServerId: string;
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  unreadCount: number;
}

export interface RouteTraceHop {
  component: 'Client' | 'Netty App Server' | 'Redis Routing' | 'Kafka Queue' | 'PostgreSQL DB';
  details: string;
  timestamp: string;
  latencyMs: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  status: DeliveryStatus;
  originServerId: string;
  targetServerId: string;
  trace: RouteTraceHop[];
}

export interface K6BenchmarkMetrics {
  concurrentConnections: number;
  messagesPerMin: number;
  p50LatencyMs: number;
  p90LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  successRatePercent: number;
  kafkaLagMessages: number;
  redisMemoryUsageMB: number;
  activeVirtualUsers: number;
}

export interface JavaCodeFile {
  id: string;
  path: string;
  filename: string;
  category: 'Netty' | 'Spring Boot' | 'Redis Routing' | 'Kafka & DB' | 'Docker & K6';
  description: string;
  content: string;
  keyHighlights: string[];
}
