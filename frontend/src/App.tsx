import { useState, useRef } from 'react';
import axios from 'axios';
import { VideoUploader } from './components/VideoUploader';
import { VibeSelector } from './components/VibeSelector';
import { Gallery } from './components/Gallery';
import { SmartPlayer } from './components/SmartPlayer';
import { LandingPage } from './components/LandingPage';
import { Loader2, Film, Camera, Sparkles, FolderOpen } from 'lucide-react';

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

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [vibe, setVibe] = useState('');
  const [frames, setFrames] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appSectionRef = useRef<HTMLDivElement>(null);

  const scrollToApp = () => {
    appSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFrames([]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('vibe_text', vibe);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFrames(response.data.best_frames);
    } catch (err) {
      setError("Failed to analyze video. Ensure backend is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-fuchsia-500/30 relative overflow-x-hidden">

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* 1. Landing Page */}
      <section className="relative z-10">
        <LandingPage
          onUploadClick={scrollToApp}
          onVibeChange={setVibe}
          currentVibe={vibe}
        />
      </section>

      {/* 2. App Studio */}
      <div ref={appSectionRef} className="relative z-20 min-h-screen">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">Studio Editor</h2>
              <p className="text-slate-400">Upload your video and let AI capture the perfect moment.</p>
            </div>
            {file && (
              <div className="mt-4 md:mt-0 flex items-center space-x-3 glass-panel px-4 py-2 rounded-xl">
                <FolderOpen className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{file.name}</span>
                <button
                  onClick={() => { setFile(null); setFrames([]); }}
                  className="text-xs text-rose-400 hover:text-rose-300 ml-4 hover:underline transition-colors"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Col: Workspace */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-8">
              {!file ? (
                <div className="glass-panel p-1 rounded-3xl">
                  <div className="bg-slate-900/50 rounded-[22px] p-8 border border-white/5">
                    <VideoUploader onFileSelect={setFile} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
                  {/* Player */}
                  <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>
                    <SmartPlayer file={file} onFrameCapture={(dataUrl, time) => {
                      setFrames(prev => [{
                        timestamp: time,
                        url: dataUrl,
                        scores: { total: 1, technical: 1, composition: 1, vibe: 1 }
                      }, ...prev]);
                    }} />
                  </div>

                  {/* Controls */}
                  <div className="glass-panel p-6 rounded-2xl space-y-6">
                    <VibeSelector value={vibe} onChange={setVibe} />

                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="w-full relative group overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full duration-1000 transform -skew-x-12 -translate-x-full transition-transform"></div>
                      <div className="flex flex-col items-center justify-center space-y-1 relative z-10">
                        {isLoading ? (
                          <>
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Matching Your Vibe...</span>
                            </div>
                            <span className="text-xs text-white/70 font-normal">
                              This may take 1-2 minutes • Analyzing frames with AI
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-5 h-5" />
                              <span>Generate Photos</span>
                            </div>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-200 text-sm rounded-xl backdrop-blur-sm">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Col: Gallery */}
            <div className="lg:col-span-12 xl:col-span-7">
              {frames.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="text-gradient">Results</span>
                      <span className="text-sm font-normal text-slate-500 ml-2 glass-panel px-2 py-1 rounded-md">({frames.length} found)</span>
                    </h3>
                  </div>
                  <Gallery frames={frames} />
                </div>
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl text-slate-500 bg-slate-900/20 backdrop-blur-sm">
                  <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/5">
                    <Film className="w-10 h-10 text-slate-600" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2 text-slate-400">No frames yet</h4>
                  <p className="max-w-xs text-slate-500">
                    Your AI-selected photos will appear here after analysis.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
