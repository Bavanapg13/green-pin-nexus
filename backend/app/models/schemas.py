from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class User(BaseModel):
    id: str
    name: str
    role: str
    department: str
    privilege_level: str
    peer_group: str
    working_hours: str

class Role(BaseModel):
    id: str
    name: str
    permissions: str

class Account(BaseModel):
    id: str
    user_id: str
    balance: float
    daily_limit: float
    status: str

class Beneficiary(BaseModel):
    id: str
    name: str
    type: str
    bank_details: str

class Transaction(BaseModel):
    id: str
    account_id: str
    beneficiary_id: str
    amount: float
    timestamp: str
    status: str

class Approval(BaseModel):
    id: str
    transaction_id: str
    approver_id: str
    status: str
    timestamp: str

class Ticket(BaseModel):
    id: str
    user_id: str
    issue: str
    status: str
    timestamp: str

class Incident(BaseModel):
    id: str
    type: str
    description: str
    status: str
    timestamp: str

class Event(BaseModel):
    id: str
    user_id: str
    action: str
    timestamp: str
    device_id: str
    location: str
    details: str

class Device(BaseModel):
    id: str
    user_id: str
    type: str
    last_used: str

class RiskScore(BaseModel):
    user_id: str
    score: float
    category: str
    breakdown: Dict[str, float]
    explanations: List[str]

class Response(BaseModel):
    id: str
    event_id: str
    action: str
    timestamp: str

class AnalystFeedback(BaseModel):
    id: str
    event_id: str
    user_id: Optional[str] = None
    analyst: Optional[str] = "SOC Analyst"
    verdict: str
    notes: Optional[str] = ""
    timestamp: str

class DashboardData(BaseModel):
    overview_kpis: Dict[str, Any]
    risk_distribution: Dict[str, int]
    system_status: str
    recentEvents: Optional[List[Dict[str, Any]]] = []

class TimelineEvent(BaseModel):
    id: Optional[str] = None
    timestamp: str
    action: str
    userId: Optional[str] = None
    amount: Optional[float] = None
    risk: str
    cumulativeScore: Optional[float] = None
    context: Optional[str] = None

class GraphData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class DemoRequest(BaseModel):
    scenario: str

class ResponseAction(BaseModel):
    action: str
    eventId: Optional[str] = None
    event_id: Optional[str] = None
    userId: Optional[str] = None
    user_id: Optional[str] = None

class FeedbackRequest(BaseModel):
    eventId: Optional[str] = None
    event_id: Optional[str] = None
    userId: Optional[str] = None
    user_id: Optional[str] = None
    type: Optional[str] = None
    verdict: Optional[str] = None
    risk_score: Optional[float] = 0.0
    analyst: Optional[str] = "SOC Analyst"
