import { UserRole } from '../contexts/AuthContext';

export const ASSET_TAGS = ['C-204', 'P-101', 'E-105'] as const;

export const USER_ROLES: UserRole[] = ['admin', 'engineer', 'technician', 'auditor', 'fan', 'volunteer'];

export const EMERGENCY_TYPES = [
  { id: 'fire', label: 'Thermal / Combustion Hazard' },
  { id: 'leak', label: 'Hazardous Fluid Leak' },
  { id: 'failure', label: 'Critical Equipment Failure' },
  { id: 'medical', label: 'Personnel Medical Emergency' }
] as const;

export const MAX_PROMPT_LENGTH = 10000;
export const API_TIMEOUT_MS = 15000;
