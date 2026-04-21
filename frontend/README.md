# Frontend

Vite React frontend for the SuperLabs backend task.

## Features

- Product search with pagination and filters
- Product detail page
- Admin create, update, and delete flows
- Reusable components and a small API layer

## Setup

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env` if you want to override the API base URL
3. Run `npm run dev`

## Environment

- `VITE_API_BASE_URL` defaults to empty, so Vite uses the `/api` proxy to `http://127.0.0.1:5001`
