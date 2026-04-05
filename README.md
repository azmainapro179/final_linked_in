# LINKEDIN (Local setup)

Frontend: React + Vite (`frontend/`), Backend: Node HTTP API (`backend/`), default API base `http://localhost:4000`.

## Run locally
```bash
# install deps
npm install

# start backend (port 4000)
npm run server

# in another terminal, start frontend (port 5173)
npm run dev
```

Optional: set API base for the frontend
- Default: `http://localhost:4000`
- Override: create `frontend/.env.local` with `VITE_API_BASE=http://localhost:4000`

## SingleStore configuration

Add the connection string to `backend/.env.local` (do not commit real credentials):
```bash
SINGLESTORE_URL=singlestore://USER:PASSWORD@HOST:PORT/DATABASE?ssl={}
```

## API endpoints (`backend/server.js`)
- `GET /api/health`
- `GET /api/profile?email=you@domain.com`
- `POST /api/signup`
- `POST /api/signin`
- `POST /api/update-profile`

## Notes
- The backend stores users in SingleStore (table `users`).
- Keep the backend running while using the UI so signup/signin/profile setup works correctly.

## Docker

This repo now includes a simple container setup:

```bash
docker compose up --build
```

That starts:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:4000`

Before running it, create `backend/.env.local` with your real `SINGLESTORE_URL`.

## Netlify

Netlify is a good fit for the `frontend/` app, but not for this long-running Node backend container.

Use this split deployment:
- Deploy `frontend/` to Netlify
- Deploy the `backend/` Docker container to a backend host like Render, Railway, Fly.io, or a VPS
- In Netlify, set `VITE_API_BASE` to your deployed backend URL

Example:

```bash
VITE_API_BASE=https://your-backend-service.example.com
```
