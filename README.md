# Backend Developer Task

Full-stack product listing application built for the SuperLabs backend assignment.

## Stack

- Backend: Node.js, Express, CORS, dotenv, nodemon
- API docs: Swagger UI / OpenAPI
- Database: PostgreSQL via `pg`
- Frontend: React + Vite

## Structure

- `backend` - Express API, Swagger docs, PostgreSQL-ready persistence
- `frontend` - React app for search, product detail, and admin CRUD

## Run

### Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Install dependencies with `npm install`
3. Run `npm run dev`

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Install dependencies with `npm install`
3. Run `npm run dev`

## API Docs

- Swagger UI: `http://localhost:5001/api/docs`

## Notes

- If `DATABASE_URL` is set, the backend uses PostgreSQL and auto-creates the `products` table.
- If PostgreSQL is not configured, the backend falls back to local seeded data so the task remains runnable.
- Admin product endpoints under `/api/admin/products` are protected by the `x-admin-token` header.
