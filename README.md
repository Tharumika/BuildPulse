# BuildPulse - CI/CD Pipeline Health Dashboard

A full-stack dashboard for monitoring build pipeline health (pass/fail rates, build duration trends, deployment frequency) built with Node.js, MongoDB, React, and Docker - deployed to AWS.

## Live Demo

- **Frontend (React on AWS S3):** [http://buildpulse-frontend.s3-website-us-east-1.amazonaws.com](http://buildpulse-frontend.s3-website-us-east-1.amazonaws.com)
- **Backend API (Node.js on Elastic Beanstalk):** [http://buildpulse-dashboard.us-east-1.elasticbeanstalk.com/health](http://buildpulse-dashboard.us-east-1.elasticbeanstalk.com/health)

## Why I built this

I noticed the JD specifically mentioned engineering metrics and developer productivity tooling - that's not something every company asks for, so I figured it reflected something the engineering team actually cares about internally. Rather than build another generic CRUD app, I built something that speaks directly to that. Without visibility into pipeline health data, teams often don't notice a CI system degrading until it's already a bottleneck - builds creeping from 2 min to 8 min, or a flaky test causing repeated failures. A simple dashboard makes that visible early.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                    │
│              React + Recharts (Vite)                │
│  SummaryCards │ PassFailChart │ DurationTrendChart  │
└────────────────────────┬────────────────────────────┘
                         │ HTTP (fetch)
                         ▼
┌─────────────────────────────────────────────────────┐
│              AWS Elastic Beanstalk                  │
│          Node.js + Express (Docker container)       │
│   POST /api/events                                  │
│   GET  /api/events?project=                         │
│   GET  /api/events/summary                          │
└────────────────────────┬────────────────────────────┘
                         │ Mongoose
                         ▼
┌─────────────────────────────────────────────────────┐
│               MongoDB Atlas (Cloud)                 │
│              Collection: buildevents                │
└─────────────────────────────────────────────────────┘

Frontend static files → AWS S3 (static website hosting)
CI runs on GitHub Actions (test-on-push)
```

## Tech Stack

Node.js · Express · MongoDB Atlas · React · Recharts · Docker · GitHub Actions · AWS Elastic Beanstalk · AWS S3

## Local Setup

```bash
# Backend
cd backend && cp .env.example .env   # fill in MONGO_URI
npm install && npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

## Seed demo data

```bash
cd backend && node scripts/seedData.js
```

Use `--clear` flag to wipe existing data and re-seed.

## Run tests

```bash
cd backend && npm test
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create a new build event |
| GET | `/api/events?project=&limit=` | List events (filtered, sorted by time) |
| GET | `/api/events/summary?project=` | Aggregated stats (pass rate, avg duration, etc.) |

## Note on build data

Build events in the demo are simulated via `seedData.js` to represent the kind of data a real CI system (like GitHub Actions webhooks) would generate. The `POST /api/events` endpoint is fully functional and accepts real events - wiring actual webhooks was out of scope for this build.

## Future improvements

- Real GitHub Actions webhook → POST to `/api/events` automatically
- CloudFront CDN in front of S3 (HTTPS + custom domain)
- Alert when failure streak > 3 (email via SES or Slack webhook)
- Per-branch breakdown in charts
