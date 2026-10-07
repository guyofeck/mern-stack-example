# AGENTS.md — AI Agent Guide

This file is the source of truth for AI agents working in this repository.

## Project Overview

Full-stack MERN CRUD app for managing employee records. React (Vite) frontend communicates with an Express REST API; MongoDB Atlas stores data in the `employees` database, `records` collection.

## Project Structure

```
mern-stack-example/
├── EDD.md                          # MongoDB data model — read before touching schema or routes
├── mern/
│   ├── client/                     # React 18 + Vite + Tailwind CSS frontend
│   │   ├── src/
│   │   │   ├── App.jsx             # Root component and routes
│   │   │   ├── components/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Record.jsx      # Create / edit form
│   │   │   │   └── RecordList.jsx  # Main list view
│   │   ├── vite.config.js
│   │   └── package.json
│   └── server/                     # Node.js + Express REST API
│       ├── db/
│       │   └── connection.js       # MongoDB Atlas connection (appName set here)
│       ├── routes/
│       │   └── record.js           # GET / POST / PATCH / DELETE /record
│       ├── seed.js                 # Database seed script
│       ├── server.js               # Express app entry point
│       └── package.json
└── .github/workflows/main.yaml     # CI: install, start, Cypress e2e
```

## Build and Test Commands

```bash
# Install and start the API server
cd mern/server
npm install
npm start           # requires mern/server/config.env (see Environment Variables)

# Install and start the React dev server
cd mern/client
npm install
npm run dev         # serves on http://localhost:5173

# Seed the database
cd mern/server
node seed.js        # requires ATLAS_URI in config.env

# Run Cypress e2e tests (client must be running)
cd mern/client
npx cypress run
```

## Environment Variables

Create `mern/server/config.env` (not committed):

| Variable    | Description                              | Example |
|-------------|------------------------------------------|---------|
| `ATLAS_URI` | MongoDB Atlas connection string          | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `PORT`      | Port for the Express server              | `5050`  |

## MongoDB Skills

Use the official MongoDB agent skills from https://github.com/mongodb/agent-skills
whenever the task is MongoDB-specific and a matching skill exists.

## When To Use EDD.md

Use [EDD.md](./EDD.md) as the source of truth for the MongoDB data model in this repository.

Consult [EDD.md](./EDD.md) before making changes that touch:

- MongoDB collections, document structure, or field names
- Express routes that read or write database records
- Validation, form fields, API payloads, or UI that depend on persisted data
- Schema documentation, Mermaid diagrams, or entity modeling discussions

## Base44 Dev Environment

- Run: `docker compose -f docker-compose.base44.yml up -d`. Client (Vite) on host port 3000; API and MongoDB are internal only.
- MongoDB is a local `mongo:7` container (no Atlas needed); `ATLAS_URI` is set via compose `environment:`, so `config.env` is not used (server runs `node --watch server.js`, not `npm start`).
- Vite proxies `/record` to `API_PROXY_TARGET` (set to `http://server:5050` in compose; defaults to `localhost:5050`).
- The server container installs its own deps on start; `seed` waits for the server to be healthy, then only runs `seed.js` when `employees.records` is empty, because `seed.js` deletes all records first.
- `seed` is a one-shot setup job: `Exited (0)` with no healthcheck is successful completion, not an application failure. Do not add a restart policy or keepalive to it; only client, server, and mongodb should remain running and healthy.
- `CYPRESS_INSTALL_BINARY=0` skips the Cypress binary download during the client's `npm ci`.
- Verify: `curl localhost:3000/record` should return the JSON records through the proxy.
- Record validation tests: `docker compose -f docker-compose.base44.yml exec -T server node --test validation/record.test.js`. POST and PATCH both require all three fields and return HTTP 400 `{ errors: { field: message } }` before writing invalid input. Legacy seed levels remain unchanged; the edit form normalizes intern/junior/senior casing, but unsupported values need a new selection.
