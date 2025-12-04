# YouTube Comment Analyzer — Backend

Simple Express + MongoDB backend providing authentication endpoints for the YouTube Comment Analyzer project.

Quick start

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies:

```powershell
cd backend; npm install
```

3. Start in development mode:

```powershell
npm run dev
```

Endpoints

- POST /api/auth/register  — register (body: name, email, password)
- POST /api/auth/login     — login (body: email, password)
- GET  /api/auth/me        — get current user (requires Authorization: Bearer <token>)

Static pages for manual testing are available under `public/` (signup/login).
