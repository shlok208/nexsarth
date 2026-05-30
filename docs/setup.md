# Setup Guide

## 1. Database Setup (Supabase)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project (Project ID: see `.env`).
3. Go to **SQL Editor** and run the `supabase_schema.sql` file from the project root.
   This creates all 4 tables: `users`, `leads`, `conversations`, `status_history`.
4. To get your database password, go to **Project Settings → Database** in the Supabase dashboard.

## 2. Environment Variables
Copy `.env.example` to `.env` in the root folder.
Update these values:
- `SUPABASE_URL` — Your Supabase project URL.
- `SUPABASE_KEY` — Your Supabase anon/public key.
- `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key.
- `SMTP_USER` — Your Gmail address.
- `SMTP_PASS` — Your Gmail App Password.

## 3. Register and Login
1. Start the backend and frontend (see below).
2. Go to `http://localhost:3000/register`.
3. Create your account.
4. Login at `http://localhost:3000/login`.
   Note: All pages except login/register are now protected and require a valid token.

## 4. Run Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
The API will run at `http://localhost:8000`.

## 5. Run Automation Worker
```bash
cd automation
pip install -r requirements.txt
python worker.py
```
This runs in a continuous loop every 15 minutes. Ensure your `.env` has the correct Gmail credentials.

## 6. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will run at `http://localhost:3000`.
