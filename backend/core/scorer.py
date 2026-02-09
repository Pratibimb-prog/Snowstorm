import numpy as np
import cv2
import torch
# from ultralytics import YOLO
# import mediapipe as mp
# import clip
# import torch

class FrameScorer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {self.device}")
        
        # Load YOLO
        try:
            from ultralytics import YOLO
            # This will download the model if not present
            self.yolo = YOLO('yolov8n.pt') 
        except Exception as e:
            print(f"Warning: YOLO not loaded. Composition score will be default. Error: {e}")
            self.yolo = None
            
        # Load CLIP
        try:
            import clip
            self.clip_model, self.clip_preprocess = clip.load("ViT-B/32", device=self.device)
        except Exception as e:
            print(f"Warning: CLIP not loaded. Vibe score will be 0. Error: {e}")
            self.clip_model = None
            self.clip_preprocess = None

    def calculate_technical_score(self, frame: np.ndarray) -> float:
        """
        Score based on:
        1. Sharpness (Laplacian variance) - STRICTER
        2. Exposure (Histogram analysis) - IMPROVED
        3. Color Vibrancy (Saturation) - NEW
        """
        if frame is None:
            return 0.0
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # 1. SHARPNESS (More lenient threshold)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        # Normalize: >500 is very sharp, <100 is blurry
        sharpness_score = np.clip(laplacian_var / 500.0, 0.0, 1.0)
        
        # 2. EXPOSURE (IMPROVED)
        # Check histogram for clipping
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        total_pixels = gray.shape[0] * gray.shape[1]
        
        # Penalize if too many pixels are clipped (pure black or white)
        clipped_dark = hist[0:10].sum() / total_pixels
        clipped_bright = hist[246:256].sum() / total_pixels
        clipping_penalty = (clipped_dark + clipped_bright) * 2
        
        mean_brightness = np.mean(gray)
        exposure_score = max(0, 1.0 - (abs(mean_brightness - 128) / 128) - clipping_penalty)
        
        # 3. COLOR VIBRANCY (NEW)
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        saturation = hsv[:, :, 1]
        mean_saturation = np.mean(saturation)
        # Higher saturation = more vibrant colors (0-255 range)
        vibrancy_score = np.clip(mean_saturation / 150.0, 0.0, 1.0)
        
        # Weighted average (prioritize sharpness and exposure)
        return 0.5 * sharpness_score + 0.3 * exposure_score + 0.2 * vibrancy_score

    def calculate_composition_score(self, frame: np.ndarray) -> float:
        """
        Score based on Rule of Thirds using Object Detection (YOLO).
        """
        if not self.yolo:
            return 0.5
            
        try:
            results = self.yolo(frame, verbose=False)
            if not results or not results[0].boxes:
                return 0.3 # Empty frame ?
            
            # Find the largest object (likely the subject)
            boxes = results[0].boxes
            areas = (boxes.xyxy[:, 2] - boxes.xyxy[:, 0]) * (boxes.xyxy[:, 3] - boxes.xyxy[:, 1])
            if len(areas) == 0:
                return 0.3
                
            max_idx = np.argmax(areas.cpu().numpy())
            box = boxes[max_idx].xywh[0] # x_center, y_center, width, height (normalized if xywhn used, but here pixels)
            
            h, w, _ = frame.shape
            cx, cy = box[0].item(), box[1].item()
            
            # Rule of thirds lines: x = 1/3 w, 2/3 w; y = 1/3 h, 2/3 h
            target_xs = [w/3, 2*w/3]
            target_ys = [h/3, 2*h/3]
            
            # Distance to nearest rule-of-thirds intersection or line
            min_dist_x = min([abs(cx - tx) for tx in target_xs]) / w
            min_dist_y = min([abs(cy - ty) for ty in target_ys]) / h
            
            # Score: 1.0 if exactly on line, lower if far
            # Heuristic: dist of 0 -> score 1. dist of 0.3 -> score 0
            comp_score_x = max(0, 1.0 - (min_dist_x / 0.15)) # 0.15 is tolerance
            comp_score_y = max(0, 1.0 - (min_dist_y / 0.15))
            
            return (comp_score_x + comp_score_y) / 2
        except Exception as e:
            print(f"YOLO Error: {e}")
            return 0.5

    def calculate_vibe_score(self, frame: np.ndarray, text_prompt: str) -> float:
        """
        Score based on semantic similarity to text_prompt using CLIP.
        """
        if not self.clip_model or not text_prompt:
            return 0.0
        
        try:
            from PIL import Image
            import clip
            # Preprocess image
            image = self.clip_preprocess(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))).unsqueeze(0).to(self.device)
            
            # Tokenize text
            text = clip.tokenize([text_prompt]).to(self.device)
            
            with torch.no_grad():
                image_features = self.clip_model.encode_image(image)
                text_features = self.clip_model.encode_text(text)
                
                # Normalize
                image_features /= image_features.norm(dim=-1, keepdim=True)
                text_features /= text_features.norm(dim=-1, keepdim=True)
                
                # Cosine similarity
                similarity = (image_features @ text_features.T).item()
                
            return max(0, similarity)
        except Exception as e:
            print(f"CLIP Error: {e}")
            return 0.0

    def get_total_score(self, frame: np.ndarray, text_prompt: str = "") -> dict:
        tech = self.calculate_technical_score(frame)
        comp = self.calculate_composition_score(frame)
        vibe = self.calculate_vibe_score(frame, text_prompt) if text_prompt else 0.0
        
        # If vibe prompt is provided, prioritize it heavily (50% weight)
        # Otherwise, focus on technical and composition
        if text_prompt:
            # Vibe-focused scoring: 50% vibe, 30% technical, 20% composition
            total = 0.5 * vibe + 0.3 * tech + 0.2 * comp
            
            # Minimum vibe threshold: reject frames that don't match user intent
            if vibe < 0.15:
                total *= 0.5  # Heavily penalize poor vibe matches
        else:
            # No vibe prompt: equal weight to technical and composition
            total = 0.6 * tech + 0.4 * comp
        
        return {
            "total": total,
            "technical": tech,
            "composition": comp,
            "vibe": vibe
        }

