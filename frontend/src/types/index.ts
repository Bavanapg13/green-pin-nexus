export interface User {
  id: string;
  name: string;
  role: string;
  riskScore: number;
}

export interface Event {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  amount?: number;
  risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: string;
}

export interface RiskScore {
  userId: string;
  score: number;
  factors: string[];
}
