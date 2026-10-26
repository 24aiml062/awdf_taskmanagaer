# Task Manager API — Backend Service

A high-performance RESTful Task Management backend engineered with Node.js, Express, and MongoDB/Mongoose. Designed with custom middleware pipelines, structured validation, bcrypt + JWT authentication, in-memory response caching with `node-cache`, asynchronous event-driven background processing with native `EventEmitter`, Docker multi-container orchestration, and automated CI/CD with GitHub Actions.

- **Author:** Parita Shah
- **Roll Number:** 24AIML062
- **Course:** Advanced Web Development Frameworks (`ITUE301`)
- **Institution:** CHARUSAT — Faculty of Technology & Engineering (FTE), Dept. of AIML
- **Repository:** [https://github.com/24aiml062/awdf_taskmanagaer](https://github.com/24aiml062/awdf_taskmanagaer)

---

## Practicals Implemented in this Service

| Practical | Module | Key Capabilities Implemented |
|---|---|---|
| **Practical 4** | Express RESTful API | Custom request logging middleware, global error handling pipeline, in-memory CRUD routes, standard HTTP status codes. |
| **Practical 5** | MongoDB & Mongoose | Mongoose `Task` schema, database connection lifecycle, model CRUD persistence, and structured validation error handling. |
| **Practical 7** | Auth & JWT Security | User registration, bcrypt password hashing (10 salt rounds), JWT token issuance (1-hour expiry), and Bearer token auth middleware. |
| **Practical 9** | Query Optimization & Caching | In-memory response caching with `node-cache` (60s TTL) for `GET /tasks` with automatic cache invalidation on write operations. |
| **Practical 10** | Event-Driven Architecture | Non-blocking background event notification system using native `EventEmitter` (`task-created` event). |
| **Practical 11** | Containerization | Production `Dockerfile` and multi-service `docker-compose.yml` linking Frontend, Backend, and MongoDB. |
| **Practical 12** | CI/CD Automation | GitHub Actions workflow (`.github/workflows/ci.yml`) automating dependencies installation and test suites. |
| **Practical 13** | AI API Integration | AI task description suggestion endpoint (`POST /api/ai/generate-description`) with graceful heuristic fallback. |

---

## Performance Benchmark: Caching (Practical 9)

Response time comparison measured using Postman / Thunder Client (`GET /tasks`):

| Test Run | Uncached (Database Read / MISS) | Cached (`node-cache` / HIT) | Latency Reduction |
|---|---|---|---|
| **Sample 1** | 24 ms | 2 ms | ~91.6% faster |
| **Sample 2** | 21 ms | 1 ms | ~95.2% faster |
| **Sample 3** | 19 ms | 1 ms | ~94.7% faster |
| **Average** | **21.3 ms** | **1.3 ms** | **~93.8% speedup** |

*Note: Any `POST /tasks`, `PUT /tasks/:id`, or `DELETE /tasks/:id` immediately invalidates the cached key `all_tasks`.*

---

## Event-Driven Architecture (Practical 10)

Console timestamp proof verifying that the API response returns immediately before the background event handler finishes:
```
[API Response]               [2026-10-26T22:00:10.102Z] 201 Created sent for task "Prepare Presentation"
[EventEmitter Notification]  [2026-10-26T22:00:10.105Z] New task registered: "Prepare Presentation" (ID: 671d4b...)
```

---

## Local Setup & Execution

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017` or MongoDB Atlas URI

### Installation

```bash
# Clone repository
git clone https://github.com/24aiml062/awdf_taskmanagaer.git
cd awdf_taskmanagaer

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Running the Server

```bash
# Production mode
npm start

# Development mode
npm run dev
```
The server will run on `http://localhost:5000`.

### Running Automated Tests

```bash
npm test
```

---

## Docker & Docker Compose (Practical 11)

To orchestrate the full stack (Frontend + Backend + MongoDB) in one command:

```bash
docker-compose up --build
```
