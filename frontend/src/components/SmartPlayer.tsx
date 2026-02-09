import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Camera } from 'lucide-react';

interface SmartPlayerProps {
    file: File;
    onFrameCapture: (frameDataUrl: string, timestamp: number) => void;
}

export function SmartPlayer({ file, onFrameCapture }: SmartPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const captureFrame = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onFrameCapture(dataUrl, videoRef.current.currentTime);
            }
        }
    };

    if (!videoUrl) return null;

    return (
        <div className="space-y-4 w-full">
            <div className="relative rounded-xl overflow-hidden bg-black shadow-lg group aspect-video">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                />

                {/* Controls Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={togglePlay} className="text-white hover:text-purple-400 p-2">
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>

                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            step="0.1"
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />

                        <span className="text-white text-sm font-mono w-16 text-right">
                            {currentTime.toFixed(1)}s
                        </span>

                        <button
                            onClick={captureFrame}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs backdrop-blur-sm transition-all"
                            title="Capture Frame"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            <p className="text-center text-xs text-gray-500">
                Pause to find specific moments, then click the camera icon to save manually.
            </p>
        </div>
    );
}
