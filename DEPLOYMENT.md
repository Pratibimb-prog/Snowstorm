# 🚀 VibeFrame Deployment Guide

This guide covers deploying VibeFrame to production using **Render** (backend) and **Vercel** (frontend).

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Option 1: Render (Full Stack)](#option-1-render-full-stack)
- [Option 2: Render + Vercel (Recommended)](#option-2-render--vercel-recommended)
- [Common Issues & Solutions](#common-issues--solutions)
- [Environment Variables](#environment-variables)

---

## 🏗️ Architecture Overview

**VibeFrame has two components:**

1. **Backend (FastAPI)**: Heavy ML processing with CLIP, YOLO, OpenCV
   - Requires: Python 3.8+, PyTorch, large model files (~20MB+)
   - Best hosted on: **Render** (supports Python, long-running processes)

2. **Frontend (React + Vite)**: Static site with API calls
   - Requires: Node.js build, serves static files
   - Best hosted on: **Vercel** or **Render**

> [!IMPORTANT]
> **Vercel cannot host the backend** because:
> - Serverless functions have 10-50s timeout limits (your ML processing takes 30-40s)
> - Limited to 250MB deployment size (PyTorch + models exceed this)
> - Not designed for heavy compute workloads

---

## 🎯 Option 1: Render (Full Stack)

Deploy both frontend and backend on Render.

### Step 1: Prepare Backend for Render

Create `render.yaml` in the project root:

```yaml
services:
  # Backend Service
  - type: web
    name: vibeframe-backend
    env: python
    region: oregon
    plan: starter  # or free
    buildCommand: "pip install -r backend/requirements.txt"
    startCommand: "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: PORT
        value: 8000
    disk:
      name: vibeframe-storage
      mountPath: /opt/render/project/backend/uploads
      sizeGB: 10

  # Frontend Service (Static Site)
  - type: web
    name: vibeframe-frontend
    env: static
    buildCommand: "cd frontend && npm install && npm run build"
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### Step 2: Update Backend for Production

Edit `backend/main.py` to use environment variables:

```python
import os

# Add CORS for production
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Get frontend URL from environment
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "https://vibeframe-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3: Update Frontend API URL

Edit `frontend/src/App.tsx`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

Create `frontend/.env.production`:

```env
VITE_API_URL=https://vibeframe-backend.onrender.com
```

### Step 4: Deploy to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **"New +"** → **"Blueprint"**
4. Connect your GitHub repo
5. Render will auto-detect `render.yaml` and create both services

---

## ⚡ Option 2: Render + Vercel (Recommended)

**Backend on Render, Frontend on Vercel** (faster frontend, better DX)

### Backend on Render

#### 1. Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: vibeframe-api
    env: python
    region: oregon
    plan: starter
    rootDir: backend
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
    disk:
      name: vibeframe-uploads
      mountPath: /opt/render/project/uploads
      sizeGB: 10
```

#### 2. Deploy Backend:
1. Go to [Render](https://dashboard.render.com/)
2. **New +** → **Web Service**
3. Connect GitHub repo
4. **Root Directory**: `backend`
5. **Build Command**: `pip install -r requirements.txt`
6. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Click **Create Web Service**
8. Note the URL: `https://vibeframe-api.onrender.com`

### Frontend on Vercel

#### 1. Create `vercel.json` in project root:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2. Add Environment Variable:

Create `frontend/.env.production`:

```env
VITE_API_URL=https://vibeframe-api.onrender.com
```

#### 3. Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

Or use the [Vercel Dashboard](https://vercel.com/):
1. Import GitHub repo
2. **Framework Preset**: Vite
3. **Root Directory**: `frontend`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**: Add `VITE_API_URL`
7. Deploy!

---

## 🔧 Common Issues & Solutions

### Issue 1: "ModuleNotFoundError" on Render

**Problem**: Missing Python dependencies

**Solution**: Ensure `requirements.txt` has all dependencies:

```txt
fastapi
uvicorn[standard]
python-multipart
opencv-python-headless  # Use headless version for servers
numpy
Pillow
torch
torchvision
ftfy
regex
tqdm
git+https://github.com/openai/CLIP.git
ultralytics
```

> [!WARNING]
> Use `opencv-python-headless` instead of `opencv-python` on servers (no GUI dependencies)

### Issue 2: "Build Exceeds Size Limit" on Vercel

**Problem**: Trying to deploy backend on Vercel

**Solution**: Only deploy frontend on Vercel. Backend must go to Render.

### Issue 3: CORS Errors

**Problem**: Frontend can't access backend API

**Solution**: Add CORS middleware in `backend/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend.vercel.app",
        "https://vibeframe-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 4: "Port Already in Use" on Render

**Problem**: Hardcoded port in backend

**Solution**: Use Render's `$PORT` environment variable:

```python
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

### Issue 5: Model Files Not Found

**Problem**: YOLO/CLIP models not loading

**Solution**: Ensure model files are committed to Git or downloaded on startup:

```python
# backend/core/scorer.py
import os
from ultralytics import YOLO

model_path = "yolov8n.pt"
if not os.path.exists(model_path):
    # Auto-download on first run
    model = YOLO("yolov8n.pt")
else:
    model = YOLO(model_path)
```

### Issue 6: Timeout During Processing

**Problem**: Render free tier has 30s timeout for HTTP requests

**Solution**: 
- Upgrade to Starter plan ($7/month, no timeout)
- Or implement async processing with webhooks/polling

### Issue 7: Static Files Not Serving

**Problem**: Extracted frames return 404

**Solution**: Mount static directory in FastAPI:

```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```

---

## 🔐 Environment Variables

### Backend (Render)

| Variable | Value | Description |
|----------|-------|-------------|
| `PYTHON_VERSION` | `3.11.0` | Python version |
| `PORT` | Auto-set by Render | Server port |
| `FRONTEND_URL` | `https://your-app.vercel.app` | For CORS |

### Frontend (Vercel)

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://vibeframe-api.onrender.com` | Backend API URL |

---

## 📊 Cost Breakdown

### Render (Backend)
- **Free Tier**: 750 hours/month, spins down after 15min inactivity
- **Starter**: $7/month, always on, no timeouts

### Vercel (Frontend)
- **Hobby**: Free, 100GB bandwidth/month
- **Pro**: $20/month, 1TB bandwidth

**Recommended**: Render Starter ($7) + Vercel Hobby (Free) = **$7/month**

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel (or Render)
- [ ] Environment variables configured
- [ ] CORS configured with production URLs
- [ ] Test video upload and processing
- [ ] Check static file serving
- [ ] Monitor Render logs for errors
- [ ] Set up custom domain (optional)

---

## 🆘 Still Having Issues?

1. **Check Render Logs**: Dashboard → Your Service → Logs
2. **Check Browser Console**: F12 → Console tab
3. **Test API Directly**: `curl https://your-backend.onrender.com/docs`
4. **Verify Environment Variables**: Render Dashboard → Environment

**Common Error Patterns:**
- `502 Bad Gateway` → Backend crashed, check Render logs
- `CORS error` → Update `allow_origins` in backend
- `404 on /static/*` → Static files not mounted correctly
- `Timeout` → Upgrade Render plan or optimize processing

---

Made with ❤️ for VibeFrame deployment
