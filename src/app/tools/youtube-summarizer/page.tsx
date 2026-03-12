'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Sparkles, Youtube, Loader2, PlayCircle } from 'lucide-react';
import { useState } from 'react';

export default function YoutubeSummarizerPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');

    const handleSummarize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        // Placeholder fetching logic
        setTimeout(() => {
            setSummary("This is a placeholder summary. In the future, this will be replaced with real AI-generated content summarizing the provided YouTube video.");
            setLoading(false);
        }, 2000);
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <Youtube className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">YouTube AI Summarizer</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">
                        Save time by generating concise, accurate summaries of long YouTube videos in seconds.
                    </p>
                </div>

                <form onSubmit={handleSummarize} className="flex flex-col sm:flex-row gap-3 mb-12 max-w-2xl mx-auto">
                    <div className="relative flex-1">
                        <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="url"
                            placeholder="Paste YouTube Video URL here..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center min-w-[140px] gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Summarize</>}
                    </button>
                </form>

                {summary && (
                    <div className="animate-fade-in-up bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-red-500" /> AI Summary
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>{summary}</p>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
