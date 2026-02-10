# 🚀 Quick Deployment Steps

## Prerequisites
- [ ] GitHub repository with all code pushed
- [ ] Render account (free tier works)
- [ ] Vercel account (optional, for frontend)

---

## 🎯 Recommended: Backend on Render + Frontend on Vercel

### Step 1: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select your repo: `Snowstorm` or `vibeframe`

3. **Configure Service**
   ```
   Name: vibeframe-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Set Environment Variables**
   - Click **"Environment"** tab
   - Add: `PYTHON_VERSION` = `3.11.0`
   - Add: `FRONTEND_URL` = `https://your-app.vercel.app` (update after deploying frontend)

5. **Add Persistent Disk (Important!)**
   - Click **"Disks"** tab
   - **"Add Disk"**
   - Name: `vibeframe-storage`
   - Mount Path: `/opt/render/project/src/uploads`
   - Size: `10 GB`

6. **Deploy**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for build
   - Copy your backend URL: `https://vibeframe-backend.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. **Update Frontend Environment**
   - Edit `frontend/.env.production`
   - Set: `VITE_API_URL=https://vibeframe-backend.onrender.com`
   - Commit and push to GitHub

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click **"Import Project"**
   - Select your GitHub repo
   
3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Environment Variable**
   - Click **"Environment Variables"**
   - Key: `VITE_API_URL`
   - Value: `https://vibeframe-backend.onrender.com`
   - Click **"Add"**

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - Your app is live! Copy the URL: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

1. **Go back to Render Dashboard**
2. **Select your backend service**
3. **Environment tab**
4. **Update `FRONTEND_URL`** to your Vercel URL: `https://your-app.vercel.app`
5. **Save Changes** (service will auto-redeploy)

---

## ✅ Testing Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Upload a test video** (keep it small, ~10-20 seconds)
3. **Check if frames are extracted**

### If Something Goes Wrong:

**Backend Issues:**
- Check Render logs: Dashboard → Your Service → **Logs** tab
- Look for Python errors, missing dependencies, or CORS issues

**Frontend Issues:**
- Open browser console (F12)
- Look for CORS errors or failed API calls
- Verify `VITE_API_URL` is correct

**Common Fixes:**
- **502 Bad Gateway**: Backend crashed, check Render logs
- **CORS Error**: Update `FRONTEND_URL` in Render environment
- **Timeout**: Render free tier spins down after 15min inactivity (first request takes ~30s to wake up)

---

## 💰 Cost

- **Render Free Tier**: Backend spins down after 15min inactivity
- **Render Starter ($7/month)**: Always on, no spin-down
- **Vercel Hobby**: Free forever

**Recommended for production**: Render Starter + Vercel Hobby = **$7/month**

---

## 🔄 Updating Your Deployment

**After making code changes:**

1. **Commit and push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Auto-deploy**
   - Render: Auto-deploys on push (if enabled)
   - Vercel: Auto-deploys on push

---

## 📝 Important Files Created

- ✅ `DEPLOYMENT.md` - Full deployment guide
- ✅ `render.yaml` - Render configuration
- ✅ `vercel.json` - Vercel configuration
- ✅ `frontend/.env.production` - Production environment variables
- ✅ `backend/main.py` - Updated with production CORS
- ✅ `backend/requirements.txt` - Updated with headless OpenCV

---

## 🆘 Need Help?

See the full troubleshooting guide in `DEPLOYMENT.md`
