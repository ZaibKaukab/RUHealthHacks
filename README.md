# Sevaro Command Center

**Every consult seen, every delay caught.**
Built for the Sevaro track at Rutgers Health Hack 2026.

## The problem

Sevaro's tele-neurologists cover stroke consults for many hospitals. Sevaro can already *see* its live workload. The gap is what happens next: when a surge of consults hits right as shifts end, someone has to notice the risk, choose a fix, and act on it in time. Today that depends on a person happening to notice.

## What it does

The Command Center turns workload data into action in three layers:

1. **Detect.** Predicts coverage gaps 60–90 minutes ahead by comparing incoming consult demand against which physicians are truly available.
2. **Decide.** Ranks off-shift physicians who could take a split shift and explains exactly why each one passed or failed eligibility.
3. **Act.** Routes the recommendation through supervisor approval and physician confirmation, then verifies that the gap actually closed.

Availability signals often disagree. A physician's status may say "available" while they're on a video call and their heartbeat stopped 10 minutes ago. The system reconciles these signals instead of trusting any single one.

## Architecture

```
Hospital data sources
(consults, schedules, video/calls, heartbeats, status updates)
        │
        ▼
API Gateway + Lambda ──────── auth, validation, event normalization
        │
        ▼
EventBridge + SQS ─────────── routing, queuing, retries, dead-letter queue
        │
        ▼
Detection layer (Lambda/ECS) ─ signal reconciliation, physician state,
        │                      deduplication, coverage forecasting
        ▼
Jev AI ────────────────────── risk scoring, urgency, conflicting-signal
        │                      review, human-review routing
        ▼
Policy + optimization engine ─ shift eligibility, rest constraints,
        │                      candidate ranking, safety checks
        ▼
Step Functions ────────────── supervisor approval → physician
        │                      confirmation → outcome check
        ▼
React + Vite Command Center ─ live predictions, assessments,
                               approvals, audit history

Storage: DynamoDB (events, state) · S3 (replay, history) · CloudWatch (logs, tracing)
```

### Key design principle

**AI advises; rules decide.** Jev AI scores risk and flags conflicting signals, but the deterministic policy engine has the final say on who is eligible. Every eligibility decision can be traced to a specific rule, such as licensure, credentialing, or rest hours, never to a model's guess.

## Components

| Component | Responsibility |
|---|---|
| API Gateway + Lambda | Receives events, authenticates, validates, normalizes to one schema |
| EventBridge + SQS | Routes events to consumers; retries failures; dead-letter queue for bad events |
| Detection layer | Deduplicates and reorders late events, reconciles availability signals, tracks physician state, forecasts demand |
| Jev AI | Scores operational risk and urgency; reviews conflicting signals; returns typed decisions with confidence |
| Policy engine | Applies eligibility and rest rules; ranks candidates with a pass/fail reason for each rule |
| Step Functions | Runs the approval workflow and confirms the intervention worked |
| React + Vite dashboard | Authenticated operational UI; polls the API every 3–5 seconds for the MVP |
| DynamoDB / S3 / CloudWatch | State and events / replay and history / logs and tracing |

## Example flow

1. At 6:30 PM, consult volume is rising and three physicians' shifts end at 7:00 PM.
2. The forecast predicts 9 consults between 7:00 and 8:30 PM against 5 available physicians.
3. The gap detector flags a coverage risk 90 minutes ahead.
4. The policy engine ranks off-shift physicians: Dr. A passes every rule; Dr. B fails the rest-hours rule; Dr. C isn't credentialed at two of the affected hospitals.
5. The supervisor approves Dr. A, Dr. A confirms, and the system checks that the gap closed.

## Live demo test

Judges inject new events mid-demo (surges, status changes, duplicate or late events). The system updates live without a restart, and the dashboard shows the recalculated gap and ranking.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Mantine, TanStack Query, React Router
- **Live updates:** 3–5 second API polling for the MVP; consider SSE for one-way push updates later
- **Ingest:** Amazon API Gateway, AWS Lambda
- **Messaging:** Amazon EventBridge, Amazon SQS
- **Compute:** AWS Lambda, Amazon ECS
- **AI:** Jev AI
- **Workflow:** AWS Step Functions
- **Storage and observability:** Amazon DynamoDB, Amazon S3, Amazon CloudWatch

## Getting started

> TODO: fill in once the repo structure is set.

```bash
git clone <repo-url>
cd <repo>
# install dependencies
# configure AWS credentials and environment variables
# deploy infrastructure
# run the dashboard locally
```

## Team

| Name | Role |
|---|---|
| | Backend |
| | |
| | |
