import { UserRole } from '../contexts/AuthContext';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  confidence?: number;
  citations?: Citation[];
}

export interface Citation {
  document: string;
  page: number;
  chunk_id?: string;
}

export interface AssetHistoryEntry {
  id: string;
  type: string;
  title: string;
  date: string;
  status: string;
  findings: string;
  reference?: string;
}

export interface AssetData {
  id: string;
  tag: string;
  name: string;
  type: string;
  location: string;
  status: string;
  plantId: string;
  history: AssetHistoryEntry[];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  group: 'equipment' | 'document' | 'work_order' | 'inspection' | 'procedure';
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  type: string;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  links: KnowledgeGraphLink[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface NotificationItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
  read: boolean;
}

export interface StewardTask {
  id: string;
  title: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | string;
  status: 'pending' | 'completed' | string;
  createdAt: string;
}

export interface BroadcastAlert {
  id: string;
  text: string;
  urgency: 'low' | 'medium' | 'high' | string;
  sentAt: string;
  sender: string;
}

export interface AnalyticsEvent {
  id: string;
  category: string;
  eventName: string;
  userEmail: string;
  timestamp: string;
}

export interface StadiumGate {
  name: string;
  flowRate: string;
  waitTime: string;
  occupancy: number;
  order: number;
}

export interface StorageItem {
  id: string;
  name: string;
  size: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface FunctionLog {
  id: string;
  functionName: string;
  status: string;
  durationMs: number;
  executedAt: string;
  output?: string;
  memoryUsedMb?: number;
}

export interface CompoundIndex {
  name: string;
  fields: string;
  usage: string;
}

/** Generic record for remote config key-value pairs */
export type RemoteConfigRecord = Record<string, boolean | string | number>;
