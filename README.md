# GREEN PIN NEXUS

> **Detect the chain, not just the event.**

## Privileged Access Intelligence Platform

GREEN PIN NEXUS is a synthetic, explainable privileged-access intelligence prototype that detects suspicious chains of authorized activity by combining behavioral anomaly detection, temporal sequence analysis, relationship intelligence, financial risk assessment, privilege risk scoring, and business-context validation.

---

> [!IMPORTANT]
> **SIMULATION ENVIRONMENT** — This is a prototype using 100% synthetic data. No real banking systems, transactions, customer data, or employee data are used. All response actions are simulated.

---

## 🎯 The Problem

Organizations grant privileged users legitimate permissions to perform critical operations — initiating payments, modifying beneficiaries, changing transaction limits, approving transactions. Traditional access control asks: *"Is this user authorized?"*

**GREEN PIN NEXUS asks: *"Is this authorized user using that authorization in a legitimate way?"***

A compromised or malicious privileged account can perform individual actions that appear authorized. Each event may look normal. **The chain of events may not.**

## 💡 Core Innovation

**"An authorized action can still be part of an illegitimate chain."**

GREEN PIN NEXUS doesn't just check individual events — it analyzes the *sequence*, *relationships*, *financial context*, and *business justification* of privileged activity chains.

```
AUTHORIZED ACTION
+ BEHAVIORAL DEVIATION
+ SEQUENCE DEVIATION
+ FINANCIAL RISK
+ PRIVILEGE RISK
+ RELATIONSHIP RISK
+ MISSING BUSINESS CONTEXT
= PRIVILEGED MISUSE RISK
```

## 🏗️ Architecture

```
SYNTHETIC PRIVILEGED EVENTS
         ↓
   DATA NORMALIZATION
         ↓
 BEHAVIORAL BASELINE
         ↓
  ML ANOMALY MODEL (Isolation Forest)
         ↓
   BEHAVIOR RISK
         ↓
  SEQUENCE ENGINE
         ↓
  RELATIONSHIP GRAPH (NetworkX)
         ↓
   FINANCIAL RISK
         ↓
   PRIVILEGE RISK
         ↓
   CONTEXT ENGINE
         ↓
    RISK ENGINE (Weighted Aggregation)
         ↓
 EXPLAINABLE ALERT
         ↓
  RESPONSE ENGINE
         ↓
 SIMULATED CONTAINMENT
         ↓
  ANALYST FEEDBACK
```

## 🔬 Detection Engines

### Behavioral Baseline
- Per-user and peer-group baselines for transaction amounts, login times, action frequency, device/location/beneficiary familiarity
- Compares current behavior against user + role + peer baselines

### ML Anomaly Detection (Isolation Forest)
- Features: transaction amount deviation, frequency, hour deviation, device/location/beneficiary novelty, activity burst
- Trained on synthetic normal data with deterministic seed
- Scores calculated from actual features (not random)

### Sequence Engine
- Detects unexpected ordering, missing workflow steps, rapid escalation
- Compares against normal workflow patterns (e.g., BENEFICIARY_MODIFIED → APPROVAL → PAYMENT)

### Financial Risk
- Transaction amount vs. normal range analysis
- Beneficiary novelty, transaction frequency, rapid escalation detection

### Privilege Risk
- Elevated risk for HIGH privilege + sensitive operations
- Sensitive ops: permission changes, limit changes, high-value payments

### Relationship Intelligence (NetworkX)
- Graph analysis of USER → ACCOUNT → BENEFICIARY → TRANSACTION relationships
- Detects new/unusual relationships, rapid multi-entity chains

### Business Context Engine
- Validates against tickets, incidents, approvals, maintenance windows
- **Unusual does not automatically mean malicious** — context matters

### Risk Aggregation
| Component | Weight |
|-----------|--------|
| Behavior Risk | 20% |
| Sequence Risk | 25% |
| Relationship Risk | 15% |
| Financial Risk | 15% |
| Privilege Risk | 10% |
| Context Risk | 10% |
| Historical Risk | 5% |

*These are prototype risk thresholds, not industry standards.*

| Score Range | Category |
|-------------|----------|
| 0–29 | LOW |
| 30–59 | MODERATE |
| 60–79 | HIGH |
| 80–100 | CRITICAL |

## 📊 Synthetic Data

All data is generated deterministically (seed=42) with:
- 100 employees across 15+ roles
- 200 accounts
- 150 beneficiaries
- 2,000 transactions
- 5,000–10,000 activity events
- 50 approvals, 50 tickets, 25 incidents

**DATA SOURCE: GREEN PIN SYNTHETIC SIMULATION**  
*No real customer, employee, transaction, or banking-system data is used.*

## 🎮 Demo Scenarios

### 1. Normal Operations
Regular privileged activity with known devices, normal hours, standard amounts, valid approvals → **LOW RISK**

### 2. Compromised Account (EMP-1042)
```
11:42  LOGIN
11:44  BENEFICIARY_MODIFIED (new beneficiary)
11:46  TRANSACTION_LIMIT_CHANGED
11:49  ₹8,50,000 PAYMENT_INITIATED
11:50  REQUIRED APPROVAL MISSING
11:51  NO BUSINESS CONTEXT
→ CRITICAL RISK
```

### 3. Legitimate Emergency (EMP-1098)
Unusual activity + valid incident + valid ticket + maintenance window + authorized role → **Risk reduced after context analysis** → VERIFY + MONITOR

## 🛠️ Tech Stack

### Backend
- Python 3.10+
- FastAPI
- scikit-learn (Isolation Forest)
- NetworkX (Relationship Graph)
- Pandas & NumPy
- SQLite

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Recharts (Charts)
- Lucide React (Icons)

## 📦 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd green-pin-nexus/backend
python -m venv venv
# Windows
venv\\Scripts\\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd green-pin-nexus/frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🧪 Testing

```bash
cd green-pin-nexus/backend
pytest tests/ -v
```

## 🎬 Demo Instructions

1. Start backend and frontend
2. Open the Overview page — see Privileged Access Security Overview
3. Click **RUN NORMAL SCENARIO** — observe LOW risk across the board
4. Click **RUN COMPROMISED ACCOUNT** — watch risk escalate to CRITICAL
5. Navigate to **Attack Timeline** — see the suspicious chain unfold
6. Check **Relationship Graph** — see the suspicious entity connections
7. Open **Context Investigation** — confirm no ticket, no approval, no justification
8. Go to **Response Center** — click Hold Payment, see HELD — SIMULATION
9. Click **Confirm Incident** — feedback recorded
10. Run **LEGITIMATE EMERGENCY** — see context reduce risk to VERIFY + MONITOR

## ⚠️ Limitations

- Prototype/simulation environment only
- Synthetic data does not capture all real-world complexity
- Risk thresholds are for demonstration, not production calibration
- ML model trained on limited synthetic data
- Not a replacement for PAM, SIEM, or UEBA products
- Does not guarantee fraud prevention
- Cannot determine user intent with certainty

## 🔮 Future Improvements

- Real-time event streaming integration
- SIEM/SOAR integration
- Advanced ML models (autoencoders, graph neural networks)
- Analyst feedback loop for model refinement
- Role-based access control for the platform itself
- Audit trail and compliance reporting
- Multi-tenant support
- API authentication and rate limiting

## 📜 Positioning

GREEN PIN NEXUS is positioned as a focused privileged-financial workflow intelligence prototype that correlates authorized actions with behavioral, temporal, relationship, financial, and business-context signals. It does not replace PAM, SIEM, or UEBA products.

## 📄 License

Hackathon Prototype — Not for Production Use

---

**GREEN PIN NEXUS** — *Detect the chain, not just the event.*
