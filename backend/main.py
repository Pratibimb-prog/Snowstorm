import os
import shutil
import uuid
from pathlib import Path
from typing import List, Dict

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import cv2

# Adjust path to import core modules if necessary, or use relative imports if running as module
# Assuming running from backend directory
from core.video_processor import VideoProcessor
from core.scorer import FrameScorer

app = FastAPI(title="VibeFrame API", description="AI-powered video frame extraction")

# CORS configuration - support both local development and production
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add production frontend URL from environment variable
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)
    print(f"Added production frontend URL to CORS: {frontend_url}")

# Also allow common deployment patterns
origins.extend([
    "https://*.vercel.app",
    "https://*.onrender.com",
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory setup
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
STATIC_DIR = BASE_DIR / "static"

UPLOAD_DIR.mkdir(exist_ok=True)
STATIC_DIR.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Initialize Scorer (Lazy load in real app, but here we init global)
scorer = FrameScorer()

@app.get("/")
def read_root():
    return {"message": "VibeFrame API is running"}

@app.post("/analyze")
async def analyze_video(
    file: UploadFile = File(...),
    vibe_text: str = Form(""),
    sample_interval: float = Form(1.0)  # 1 second intervals for faster processing
):
    try:
        print(f"Starting video analysis...")
        
        # 1. Save uploaded file
        file_ext = file.filename.split(".")[-1]
        video_id = str(uuid.uuid4())
        video_filename = f"{video_id}.{file_ext}"
        video_path = UPLOAD_DIR / video_filename
        
        with video_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"Video saved: {video_path}")
            
        # 2. Process Video
        try:
            processor = VideoProcessor(str(video_path))
        except Exception as e:
            print(f"Error loading video: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid video file: {str(e)}")
        
        
        # Create a directory for this video's frames
        frames_dir = STATIC_DIR / video_id
        frames_dir.mkdir(exist_ok=True)
        
        # OPTIMIZATION: Two-pass approach for speed
        # Pass 1: Quick technical scoring only (no CLIP)
        candidates = []
        try:
            for timestamp, frame in processor.sample_frames(interval=sample_interval):
                # Quick technical + composition score (fast)
                tech_score = scorer.calculate_technical_score(frame)
                comp_score = scorer.calculate_composition_score(frame)
                
                # Only keep frames with decent technical quality (lowered threshold for better results)
                if tech_score > 0.1:  # Very low threshold to ensure we get results
                    candidates.append({
                        "timestamp": timestamp,
                        "frame": frame,
                        "tech_score": tech_score,
                        "comp_score": comp_score
                    })
        except Exception as e:
            print(f"Error during frame sampling: {e}")
            raise HTTPException(status_code=500, detail=f"Error processing video frames: {str(e)}")
        
        print(f"Found {len(candidates)} candidate frames")
        
        
        # Sort by technical + composition score
        candidates.sort(key=lambda x: (x["tech_score"] + x["comp_score"]) / 2, reverse=True)
        
        # Handle edge case: no candidates
        if not candidates:
            return {
                "video_id": video_id,
                "total_frames_processed": 0,
                "best_frames": [],
                "error": "No frames met minimum quality threshold"
            }
        
        # Pass 2: Only run expensive CLIP on top 10 candidates (or all if less than 10)
        # This is the main speed bottleneck - fewer CLIP calls = much faster
        top_candidates = candidates[:min(10, len(candidates))]
        
        print(f"Running CLIP on top {len(top_candidates)} candidates...")
        
        for i, candidate in enumerate(top_candidates):
            try:
                # Now add vibe score (expensive CLIP operation)
                vibe_score = scorer.calculate_vibe_score(candidate["frame"], vibe_text) if vibe_text else 0.0
                
                # Calculate final score with proper weighting
                if vibe_text:
                    total = 0.5 * vibe_score + 0.3 * candidate["tech_score"] + 0.2 * candidate["comp_score"]
                    if vibe_score < 0.15:
                        total *= 0.5
                else:
                    total = 0.6 * candidate["tech_score"] + 0.4 * candidate["comp_score"]
                
                candidate["vibe_score"] = vibe_score
                candidate["total_score"] = total
                
                print(f"Processed candidate {i+1}/{len(top_candidates)}")
            except Exception as e:
                print(f"Error scoring candidate {i}: {e}")
                # If CLIP fails, use technical + composition only
                candidate["vibe_score"] = 0.0
                candidate["total_score"] = 0.6 * candidate["tech_score"] + 0.4 * candidate["comp_score"]
        
        # Sort by final score
        top_candidates.sort(key=lambda x: x["total_score"], reverse=True)
        
        # Apply diversity filter (simplified - just take top frames with 2s spacing)
        diverse_frames = []
        last_timestamp = -999
        
        for candidate in top_candidates:
            if candidate["timestamp"] - last_timestamp >= 2.0:
                diverse_frames.append(candidate)
                last_timestamp = candidate["timestamp"]
                
                if len(diverse_frames) >= 5:
                    break
        
        # If not enough diverse frames, just take top 5
        if len(diverse_frames) < 5:
            diverse_frames = top_candidates[:5]
        
        # Save only the best frames
        results = []
        for candidate in diverse_frames:
            frame_filename = f"frame_{int(candidate['timestamp']*1000)}.jpg"
            frame_path = frames_dir / frame_filename
            cv2.imwrite(str(frame_path), candidate["frame"])
            
            frame_url = f"/static/{video_id}/{frame_filename}"
            
            results.append({
                "timestamp": candidate["timestamp"],
                "url": frame_url,
                "scores": {
                    "total": candidate["total_score"],
                    "technical": candidate["tech_score"],
                    "composition": candidate["comp_score"],
                    "vibe": candidate.get("vibe_score", 0.0)
                }
            })
        
        print(f"Analysis complete! Returning {len(results)} frames")
        
        return {
            "video_id": video_id,
            "total_frames_processed": len(candidates),
            "best_frames": results
        }


            
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Use PORT from environment variable (required for Render)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
