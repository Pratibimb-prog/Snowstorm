import { useState } from 'react';
import { Download, Maximize2, Trophy, Star, X, Share2, Sparkles } from 'lucide-react';

interface FrameScores {
    total: number;
    technical: number;
    composition: number;
    vibe: number;
}

interface Frame {
    timestamp: number;
    url: string;
    scores: FrameScores;
}

interface GalleryProps {
    frames: Frame[];
}

export function Gallery({ frames }: GalleryProps) {
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

    if (frames.length === 0) return null;

    const bestFrame = frames[0];
    const runnerUps = frames.slice(1);

    const getFullUrl = (url: string) => url.startsWith('data:') ? url : `http://localhost:8000${url}`;

    return (
        <div className="space-y-16">
            {/* Winner Section */}
            <div className="relative group perspective-1000">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
                    <div className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-yellow-950 px-8 py-2.5 rounded-full font-bold shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center space-x-2 border border-yellow-200">
                        <Trophy className="w-5 h-5" />
                        <span>Best Vibe Match</span>
                    </div>
                </div>

                <div
                    className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-yellow-500/50 transition-all duration-500 cursor-zoom-in"
                    onClick={() => setSelectedFrame(bestFrame)}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent group-hover:opacity-100 opacity-50 transition-opacity"></div>
                    <img
                        src={getFullUrl(bestFrame.url)}
                        alt={`Best Frame`}
                        className="w-full h-full object-contain bg-black/50 transform transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                        <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div>
                                <div className="text-white font-black text-5xl mb-2 tracking-tighter drop-shadow-lg">
                                    {(bestFrame.scores.total * 100).toFixed(0)}<span className="text-2xl opacity-60 font-medium">/100</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium text-white border border-white/10">
                                        {(bestFrame.timestamp).toFixed(1)}s
                                    </span>
                                    <span className="text-purple-300 text-sm font-medium flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Top Choice
                                    </span>
                                </div>
                            </div>

                            <button className="bg-white text-slate-950 px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center space-x-2 shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95">
                                <Maximize2 className="w-5 h-5" />
                                <span>Inspect</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Runner Ups Masonry */}
            {runnerUps.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <Star className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Honorable Mentions</span>
                    </h3>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {runnerUps.map((frame, index) => (
                            <div
                                key={index}
                                className="group break-inside-avoid relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.2)] cursor-zoom-in"
                                onClick={() => setSelectedFrame(frame)}
                            >
                                <img
                                    src={getFullUrl(frame.url)}
                                    alt={`Runner up`}
                                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <div className="w-full flex justify-between items-center transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <span className="text-white font-bold text-lg">
                                            {(frame.scores.total * 100).toFixed(0)}
                                        </span>
                                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white">
                                            <Maximize2 className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Enhanced Lightbox */}
            {selectedFrame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedFrame(null)}></div>

                    <button
                        onClick={() => setSelectedFrame(null)}
                        className="absolute top-6 right-6 p-3 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 z-50"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative z-40 max-w-7xl w-full h-[90vh] flex flex-col md:flex-row gap-8 bg-slate-900/50 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        {/* Image Side */}
                        <div className="relative w-full md:w-3/4 h-1/2 md:h-full bg-black flex items-center justify-center group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/20 to-black opacity-50"></div>
                            <img
                                src={getFullUrl(selectedFrame.url)}
                                alt="Full view"
                                className="max-w-full max-h-full object-contain relative z-10 shadow-2xl"
                            />
                        </div>

                        {/* Info Side */}
                        <div className="w-full md:w-1/4 h-1/2 md:h-full bg-slate-900 border-l border-white/10 p-8 flex flex-col overflow-y-auto">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Frame Analysis</h2>
                                <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
                                    Timestamp: <span className="text-purple-400">{(selectedFrame.timestamp).toFixed(3)}s</span>
                                </p>
                            </div>

                            <div className="space-y-6 flex-1">
                                {/* Total Score */}
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-sm text-purple-200 font-medium">Vibe Score</div>
                                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                            {(selectedFrame.scores.total * 100).toFixed(0)}
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                                            style={{ width: `${selectedFrame.scores.total * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Detail Scores */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Metrics</h4>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                        <span className="text-slate-300 text-sm">Technical</span>
                                        <span className="font-bold text-blue-400">{(selectedFrame.scores.technical * 100).toFixed(0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                        <span className="text-slate-300 text-sm">Composition</span>
                                        <span className="font-bold text-green-400">{(selectedFrame.scores.composition * 100).toFixed(0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                        <span className="text-slate-300 text-sm">Vibe Match</span>
                                        <span className="font-bold text-pink-400">{(selectedFrame.scores.vibe * 100).toFixed(0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 space-y-3">
                                <a
                                    href={getFullUrl(selectedFrame.url)}
                                    download={`vibeframe-${selectedFrame.timestamp}.jpg`}
                                    className="w-full flex items-center justify-center space-x-2 bg-white text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-purple-50 hover:text-purple-900 transition-all shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download Frame</span>
                                </a>
                                <button className="w-full flex items-center justify-center space-x-2 bg-white/5 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors border border-white/5">
                                    <Share2 className="w-5 h-5" />
                                    <span>Share Result</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
