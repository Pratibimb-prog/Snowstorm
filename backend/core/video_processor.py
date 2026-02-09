import cv2
import numpy as np
from typing import List, Generator

class VideoProcessor:
    def __init__(self, video_path: str):
        self.video_path = video_path
        self.cap = cv2.VideoCapture(video_path)
        if not self.cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")
        
        self.fps = self.cap.get(cv2.CAP_PROP_FPS)
        self.frame_count = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))
        self.duration = self.frame_count / self.fps

    def get_frame_at_time(self, timestamp: float) -> np.ndarray:
        """Extract a specific frame at a timestamp (in seconds)."""
        frame_no = int(timestamp * self.fps)
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
        ret, frame = self.cap.read()
        if not ret:
            raise ValueError(f"Could not read frame at {timestamp}s")
        return frame

    def sample_frames(self, interval: float = 1.0) -> Generator[tuple[float, np.ndarray], None, None]:
        """
        Generator that yields (timestamp, frame) every `interval` seconds.
        Uses adaptive sampling for better frame selection.
        """
        current_time = 0.0
        
        while current_time < self.duration:
            try:
                frame = self.get_frame_at_time(current_time)
                yield current_time, frame
            except ValueError:
                break
            current_time += interval


    def __del__(self):
        if self.cap:
            self.cap.release()
