'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Youtube, Wand2, Play, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function YoutubeSummarizerPage() {
    const [url, setUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        if (!url.trim()) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        setLoading(true);
        setError('');
        setSummary('');

        try {
            const response = await fetch('/api/tools/youtube', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate summary');
            }

            setSummary(data.summary);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 page-enter">
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-2xl bg-rose-100 p-3 text-rose-700 shadow-sm">
                        <Youtube className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">YouTube AI Summarizer</h1>
                        <p className="text-slate-600">Turn long videos into quick readable summaries.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Input Section */}
                    <Card className="relative overflow-hidden border-rose-200/70 shadow-sm">
                        {/* Decorative background pulse */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

                        <CardHeader>
                            <CardTitle>Generate Summary</CardTitle>
                            <CardDescription>Paste any public YouTube video link below to extract its key points.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form 
                                className="flex flex-col sm:flex-row gap-3"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSummarize();
                                }}
                            >
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Play className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        type="url"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="h-12 bg-white pl-10 text-base"
                                    />
                                </div>
                                <Button 
                                    type="submit"
                                    disabled={loading || !url.trim()}
                                    className="h-12 gap-2 bg-gradient-to-r from-rose-600 to-red-600 px-8 text-white"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    {loading ? 'Processing...' : 'Summarize'}
                                </Button>
                            </form>
                            {error && (
                                <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                                    {error}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Output Section */}
                    <div className="space-y-4">
                        <h3 className="px-1 text-lg font-semibold text-slate-900">Summary Result</h3>
                        
                        {!summary && !loading && (
                            <Card className="relative flex min-h-[300px] items-center justify-center border-dashed border-2 border-slate-200 bg-slate-50 shadow-none">
                                <div className="text-center p-8 max-w-sm">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                                        <Youtube className="w-8 h-8 text-red-400" />
                                    </div>
                                    <h4 className="mb-2 font-medium text-slate-900">No summary yet</h4>
                                    <p className="text-sm text-slate-500">
                                        Paste a video URL above and click summarize to see the AI magic happen. Note: The video must have closed captions enabled.
                                    </p>
                                </div>
                            </Card>
                        )}

                        {loading && (
                            <Card className="flex min-h-[300px] flex-col items-center justify-center space-y-4 border-dashed border-2 border-rose-200 bg-rose-50/70 text-rose-700 shadow-none">
                                <Loader2 className="w-10 h-10 animate-spin" />
                                <div className="text-center">
                                    <p className="font-medium animate-pulse">Extracting Transcript & Summarizing...</p>
                                    <p className="mt-1 text-sm text-rose-600/80">This usually takes 5-10 seconds depending on the video length.</p>
                                </div>
                            </Card>
                        )}

                        {summary && !loading && (
                            <Card className="overflow-hidden border-slate-200/70 bg-white shadow-sm">
                                <CardContent className="p-0">
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Wand2 className="w-4 h-4 text-sky-600" />
                                            <span className="text-sm font-semibold text-slate-900">AI Generated Summary</span>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8 text-xs font-medium cursor-pointer"
                                            onClick={() => navigator.clipboard.writeText(summary)}
                                        >
                                            Copy to Clipboard
                                        </Button>
                                    </div>
                                    <div className="max-w-none p-6 text-gray-700 prose prose-sky prose-sm leading-relaxed sm:prose-base md:p-8">
                                        <ReactMarkdown>{summary}</ReactMarkdown>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
