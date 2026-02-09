import { Sparkles, Wand2 } from 'lucide-react';

interface VibeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function VibeSelector({ value, onChange }: VibeSelectorProps) {
    const suggestions = [
        "Cinematic Lighting", "Golden Hour", "Moody Rain",
        "Cyberpunk Neon", "Minimalist White", "Action Motion",
        "Portrait Bokeh", "Vintage Film"
    ];

    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-slate-300 ml-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Describe the Vibe
                </div>
                <span className="text-xs text-slate-500 font-normal">AI-Powered Search</span>
            </label>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl opacity-20 group-hover:opacity-60 transition duration-500 blur-md group-focus-within:opacity-100 group-focus-within:duration-200"></div>
                <div className="relative flex items-center bg-slate-900 rounded-xl p-1 pr-2 border border-white/10 shadow-xl">
                    <div className="pl-4 pr-2">
                        <Wand2 className="w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="e.g. 'Epic sunset over mountains'..."
                        className="w-full bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 py-3 text-base font-medium"
                    />
                </div>
            </div>

            {/* Smart Chips */}
            <div className="flex flex-wrap gap-2">
                {suggestions.map((vibe) => (
                    <button
                        key={vibe}
                        onClick={() => onChange(vibe)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 text-xs font-medium text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                    >
                        {vibe}
                    </button>
                ))}
            </div>
        </div>
    );
}
