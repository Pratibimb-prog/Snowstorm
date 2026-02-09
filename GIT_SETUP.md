# Git Setup Guide for VibeFrame

## Initial Setup

### 1. Initialize Git Repository

```bash
cd c:\Users\91807\.gemini\antigravity\scratch\vibe_frame
git init
```

### 2. Add All Files

```bash
git add .
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: VibeFrame AI video frame extraction app"
```

## Create GitHub Repository

### Option 1: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not already installed
# Download from: https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository
gh repo create vibeframe --public --source=. --remote=origin --push

# Description
gh repo edit --description "AI-powered video frame extraction that captures the perfect moment matching your vibe"

# Add topics
gh repo edit --add-topic ai,video-processing,clip,computer-vision,react,fastapi
```

### Option 2: Manual Setup

1. **Go to GitHub.com** and create a new repository named `vibeframe`
2. **Don't initialize** with README, .gitignore, or license (we already have these)
3. **Copy the repository URL** (e.g., `https://github.com/yourusername/vibeframe.git`)
4. **Add remote and push:**

```bash
git remote add origin https://github.com/yourusername/vibeframe.git
git branch -M main
git push -u origin main
```

## Project Structure (Already Organized)

Your project is already well-structured:

```
vibe_frame/
├── backend/          ✅ Backend API and ML logic
├── frontend/         ✅ React frontend
├── README.md         ✅ Documentation
├── .gitignore        ✅ Git ignore rules
├── LICENSE           ✅ MIT License
└── run_project.ps1   ✅ Startup script
```

## What Gets Pushed to GitHub

### ✅ Included:
- Source code (`backend/`, `frontend/src/`)
- Configuration files (`package.json`, `requirements.txt`, etc.)
- Documentation (`README.md`, `LICENSE`)
- Scripts (`run_project.ps1`)

### ❌ Excluded (via .gitignore):
- `node_modules/` (frontend dependencies)
- `venv/` (Python virtual environment)
- `backend/uploads/` (temporary video uploads)
- `backend/static/` (generated frames)
- `backend/*.pt` (YOLO model weights - too large)
- Build artifacts (`dist/`, `build/`)
- IDE files (`.vscode/`, `.idea/`)

## Repository Settings

### Recommended Settings:

1. **Description**: "AI-powered video frame extraction that captures the perfect moment matching your vibe"

2. **Topics**: 
   - `ai`
   - `video-processing`
   - `clip`
   - `computer-vision`
   - `react`
   - `fastapi`
   - `machine-learning`
   - `yolo`

3. **About Section**:
   - Website: Your deployment URL (if any)
   - Check "Use your GitHub Pages website"

4. **Features**:
   - ✅ Issues
   - ✅ Discussions (optional)
   - ✅ Wiki (optional)

## Future Updates

### To push changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

### To create a new branch:

```bash
git checkout -b feature/your-feature-name
# Make changes
git add .
git commit -m "Add your feature"
git push -u origin feature/your-feature-name
```

## Notes

- **YOLO Model**: The `yolov8n.pt` file is gitignored due to size. Users will need to download it on first run (happens automatically).
- **Environment Variables**: If you add any API keys or secrets, use a `.env` file (already gitignored).
- **Large Files**: If you need to commit large files, consider using Git LFS.

## Deployment

For deployment instructions, see the main README.md file.

---

**Ready to push!** Your project is well-organized and ready for GitHub. 🚀
