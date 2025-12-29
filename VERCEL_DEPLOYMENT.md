# Vercel Deployment Guide

## Overview
This portfolio app consists of two separate services:
- **Frontend**: React/Vite app (hosted on Vercel)
- **Backend**: Node.js/Express API (hosted separately on Vercel or Railway)

## Files to Hide (.gitignore)

### Frontend (.env files to hide)
```
.env
.env.local
.env.*.local
.env.production
node_modules/
dist/
.DS_Store
```

### Backend (.env files to hide)
```
.env
.env.local
.env.*.local
uploads/*
node_modules/
```

**IMPORTANT**: Never commit `.env` files with sensitive credentials to git. Only commit `.env.example` as a template.

---

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Choose the `frontend` directory as root
5. Click "Deploy"

### Step 3: Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_GA_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
VITE_API_URL=https://your-backend-domain.vercel.app
```

The deployed frontend will be: `https://your-frontend.vercel.app`

---

## Backend Deployment

### Option A: Deploy on Vercel (Recommended for simplicity)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Choose the `backend` directory as root
5. Set Runtime to Node.js

#### Add Environment Variables in Vercel:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key
PORT=3001
FRONTEND_ORIGIN=https://your-frontend.vercel.app
ADMIN_USERNAME=admin25
ADMIN_PASSWORD=your_secure_password
```

**Deploy URL will be**: `https://your-backend.vercel.app`

### Option B: Deploy on Railway.app (Alternative)

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Add environment variables in Railway dashboard
5. Get deployment URL

---

## Update After Deployment

### Update Frontend's API URL
Once backend is deployed, update `VITE_API_URL` in Vercel:

```
VITE_API_URL=https://your-backend-domain.vercel.app
```

### Update Backend's CORS Origin
Update `FRONTEND_ORIGIN` in backend environment:

```
FRONTEND_ORIGIN=https://your-frontend.vercel.app
```

---

## Environment Variables Summary

### Frontend (.env or Vercel)
```
VITE_GA_MEASUREMENT_ID=G-XXXXX          # Google Analytics ID
VITE_API_URL=https://backend-url.com    # Backend API URL
```

### Backend (.env or Vercel/Railway)
```
MONGO_URI=mongodb+srv://...             # MongoDB connection
JWT_SECRET=your_secret_key              # Secret for JWT tokens
PORT=5000                               # Server port
FRONTEND_ORIGIN=https://frontend-url    # Frontend URL for CORS
ADMIN_USERNAME=admin25                  # Admin login username
ADMIN_PASSWORD=portfolio25Irfan         # Admin login password
```

---

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
# Server runs on http://localhost:5173
# Uses VITE_API_URL=http://localhost:5000
```

### Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
# Uses FRONTEND_ORIGIN=http://localhost:5173
```

---

## Security Checklist

- ✅ Never commit `.env` files
- ✅ Use `.env.example` as template
- ✅ Add `.env` to `.gitignore`
- ✅ Set secrets in Vercel/Railway dashboard only
- ✅ Use different passwords for prod vs local
- ✅ Regenerate JWT_SECRET for production
- ✅ Use MongoDB Atlas (cloud) for production
- ✅ Enable CORS only for your frontend domain

---

## Common Issues

### CORS Errors
Update backend `FRONTEND_ORIGIN` to match deployed frontend URL

### API Connection Failed
Verify `VITE_API_URL` matches deployed backend URL

### Environment Variables Not Loading
Clear Vercel cache and redeploy

---

## Vercel Deployment Checklist

- [ ] Push code to GitHub
- [ ] Set up frontend on Vercel
- [ ] Set up backend on Vercel/Railway
- [ ] Set environment variables in Vercel/Railway dashboard
- [ ] Update CORS settings
- [ ] Test API connectivity
- [ ] Verify Google Analytics is working
- [ ] Test login/admin features
