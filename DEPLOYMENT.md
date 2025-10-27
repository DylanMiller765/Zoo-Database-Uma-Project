# Deployment Guide

## Overview
- **Frontend**: Next.js app → Deploy to Vercel
- **Backend**: Express API → Deploy to Railway
- **Database**: MySQL → Already on Railway

## Backend Deployment (Railway)

### Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Railway will auto-detect it's a Node.js project
5. Set the **Root Directory** to `backend`
6. Add environment variables in Railway dashboard:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=nozomi.proxy.rlwy.net
   DB_PORT=43756
   DB_USER=root
   DB_PASSWORD=tPLlbwDQnpriZFlWvJThTwkBStwJVmvc
   DB_NAME=zoo_database
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
7. Railway will automatically run `npm install` and `npm run build`
8. The start command should be `npm start`
9. After deployment, copy your Railway backend URL (e.g., `https://zoo-backend-production.up.railway.app`)

### Step 2: Update CORS Settings

After you get your Vercel frontend URL, update the `CORS_ORIGIN` environment variable in Railway to match your Vercel URL.

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Set **Root Directory** to `frontend`
6. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app/api
   ```
   (Replace with your actual Railway backend URL from Backend Step 1)
7. Click "Deploy"

### Step 2: Verify Deployment

1. Open your Vercel URL
2. Try to login at `/admin/login`
3. Test that the admin dashboard loads data
4. Check that all pages work correctly

## Troubleshooting

### CORS Issues
If you see CORS errors:
- Make sure `CORS_ORIGIN` in Railway backend matches your Vercel URL exactly
- Redeploy the backend after updating CORS_ORIGIN

### API Connection Issues
If the frontend can't connect to the backend:
- Verify `NEXT_PUBLIC_API_URL` in Vercel matches your Railway URL
- Make sure the Railway backend is running (check logs)
- Test the backend API directly: `https://your-backend.railway.app/api/health`

### Database Connection Issues
- Verify all DB_* environment variables are correct in Railway
- The database credentials should match what's in `backend/.env.example`

## Local Development

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend:
```bash
cd backend
npm install
npm run dev
```

Make sure both have their respective `.env` files configured.
# Deployment ready
