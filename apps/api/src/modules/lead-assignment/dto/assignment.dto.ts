export interface AssignmentResult {
  leadId: string;
  assignedTo: string | null;
  executiveName: string | null;
  assignedAt: string | null;
  method: 'auto' | 'manual' | 'queued';
  reason: string;
}

export interface ExecutiveCandidate {
  id: string;
  fullName: string;
  city: string | null;
  productExpertise: string[];
  activeLeadCount: number;
  lastAssignmentAt: Date | null;
  maxActiveLeads: number;
}

export interface UnassignedQueueEntry {
  leadId: string;
  queuedAt: Date;
  escalationCount: number;
  lastEscalatedAt: Date | null;
}
