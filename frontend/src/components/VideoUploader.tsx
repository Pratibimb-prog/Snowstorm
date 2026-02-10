import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';

interface VideoUploaderProps {
    onFileSelect: (file: File) => void;
}

export function VideoUploader({ onFileSelect }: VideoUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    const validateFile = (file: File) => {
        if (!validTypes.includes(file.type)) {
            setError("Unsupported file format. Please use MP4, MOV, or WEBM.");
            return false;
        }
        if (file.size > maxSize) {
            setError("File size too large. Max 100MB.");
            return false;
        }
        return true;
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setError(null);
                onFileSelect(file);
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setError(null);
                onFileSelect(file);
            }
        }
    };

    const onButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`
                relative overflow-hidden rounded-2xl transition-all duration-500 ease-out cursor-pointer group min-h-[400px] flex flex-col items-center justify-center
                ${dragActive
                    ? 'bg-purple-500/10 scale-[1.01]'
                    : 'bg-slate-900/40 hover:bg-slate-800/60'
                }
            `}
        >
            {/* Animated Border */}
            <div className={`absolute inset-0 border-2 border-dashed transition-colors duration-300 rounded-2xl pointer-events-none z-10
                ${dragActive ? 'border-purple-400' : 'border-white/10 group-hover:border-purple-500/30'}`}></div>

            <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={handleChange}
            />

            <div className="text-center relative z-20 space-y-6">
                <div className="relative inline-flex">
                    <div className={`absolute inset-0 bg-purple-500 blur-xl opacity-20 rounded-full transition-all duration-700 ${dragActive || 'group-hover:opacity-40'}`}></div>
                    <div className={`
                        w-24 h-24 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-xl transition-transform duration-500
                        ${dragActive ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:-rotate-3'}
                    `}>
                        {dragActive ? (
                            <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                        ) : (
                            <Upload className="w-10 h-10 text-slate-400 group-hover:text-purple-400 transition-colors" />
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                        {dragActive ? "Drop it like it's hot!" : "Upload Visuals"}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                        Drag & drop to begin specific frame extraction. <br />
                        <span className="text-slate-500 text-xs">MP4, MOV, WEBM up to 100MB</span>
                    </p>
                </div>

                <div className={`
                    px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-slate-300 transition-all duration-300
                    ${dragActive ? 'bg-purple-500/20 border-purple-500/30 text-purple-200' : 'group-hover:bg-white/10 group-hover:text-white'}
                `}>
                    Browse Files
                </div>

                {error && (
                    <div className="absolute top-4 left-0 right-0 mx-auto w-max flex items-center space-x-2 text-red-200 text-sm bg-red-950/50 border border-red-500/30 px-4 py-2 rounded-lg animate-slide-up backdrop-blur-md">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
