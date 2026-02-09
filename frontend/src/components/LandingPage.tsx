import { Search, Upload, TrendingUp, Zap, Sparkles } from 'lucide-react';

interface LandingPageProps {
    onUploadClick: () => void;
    onVibeChange: (vibe: string) => void;
    currentVibe: string;
}

export function LandingPage({ onUploadClick, onVibeChange, currentVibe }: LandingPageProps) {
    return (
        <div className="relative w-full overflow-hidden">

            {/* 1. Hero Section */}
            <div className="relative min-h-screen w-full flex flex-col justify-center items-center text-center px-4 py-20">

                {/* Navbar */}
                <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
                    <div className="flex items-center space-x-3 opacity-0 animate-[slideDown_0.6s_ease-out_0.1s_forwards]">
                        <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">VibeFrame</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 opacity-0 animate-[slideDown_0.6s_ease-out_0.2s_forwards]">
                        <span className="text-sm font-medium text-slate-300 hover:text-white cursor-pointer transition-colors">Showcase</span>
                        <span className="text-sm font-medium text-slate-300 hover:text-white cursor-pointer transition-colors">Pricing</span>
                        <span className="text-sm font-medium text-slate-300 hover:text-white cursor-pointer transition-colors">API</span>
                    </div>

                    <button
                        onClick={onUploadClick}
                        className="hidden md:flex bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/10 text-white font-medium px-6 py-2.5 rounded-full transition-all backdrop-blur-md opacity-0 animate-[slideDown_0.6s_ease-out_0.3s_forwards]"
                    >
                        Sign In
                    </button>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-5xl space-y-12 mt-20">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md mb-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-slate-300">V2.0 Now Available</span>
                    </div>

                    {/* Main Heading */}
                    <div className="space-y-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 tracking-tight leading-none drop-shadow-2xl">
                            Frame Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Perfect Vibe</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Extract cinematic shots from your videos instantly using AI.
                            Just describe the mood, and we'll find the frame.
                        </p>
                    </div>

                    {/* Vibe Search Input */}
                    <div className="max-w-2xl mx-auto relative group opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full opacity-25 group-hover:opacity-75 blur transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full p-2 h-16 shadow-2xl">
                            <Search className="text-slate-400 w-6 h-6 ml-4" />
                            <input
                                type="text"
                                value={currentVibe}
                                onChange={(e) => onVibeChange(e.target.value)}
                                placeholder="Describe your vibe (e.g. 'Cyberpunk', 'Moody')..."
                                className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-lg px-4"
                            />
                            <button
                                onClick={onUploadClick}
                                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-full px-8 h-12 font-bold transition-all shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
                        <button
                            onClick={onUploadClick}
                            className="group relative w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)]"
                        >
                            <span className="flex items-center gap-2">
                                Start Creating <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </button>

                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5" /> View Demo
                        </button>
                    </div>

                    {/* Tags */}
                    <div className="pt-12 flex flex-wrap justify-center gap-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.2s_forwards]">
                        {['Cinematic', 'Neon Nights', 'Golden Hour', 'Cyberpunk', 'Minimalist', 'Retro'].map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm font-medium hover:border-slate-500 hover:text-white transition-all cursor-pointer hover:scale-105"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Visual Marquee / Grid Preview */}
            <div className="w-full bg-gradient-to-b from-slate-900 to-slate-950 py-32 border-t border-white/5 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                        <div className="space-y-3">
                            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Curated Collections</h2>
                            <p className="text-slate-400 text-lg">Explore frames extracted by our community.</p>
                        </div>
                        <button className="text-violet-400 font-medium hover:text-violet-300 flex items-center gap-2 group transition-all">
                            See all <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-white/5 hover:border-violet-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)]"
                                style={{
                                    opacity: 0,
                                    animation: `fadeInUp 0.8s ease-out ${1.6 + i * 0.15}s forwards`
                                }}
                            >
                                <img
                                    src={`https://picsum.photos/seed/${i * 123}/600/800`}
                                    alt="Showcase"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-bold text-xl mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Neon Dreams</h3>
                                    <p className="text-slate-300 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">Extracted from 4K footage</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
