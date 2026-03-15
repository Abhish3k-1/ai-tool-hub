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
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                        <Youtube className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">YouTube AI Summarizer</h1>
                        <p className="text-gray-500">Turn long videos into quick readable summaries.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Input Section */}
                    <Card className="border-red-100 shadow-sm overflow-hidden relative">
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
                                        className="pl-10 h-12 text-base border-gray-200 focus-visible:ring-red-500 bg-white"
                                    />
                                </div>
                                <Button 
                                    type="submit"
                                    disabled={loading || !url.trim()}
                                    className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white gap-2 shadow-md shadow-red-500/20"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    {loading ? 'Processing...' : 'Summarize'}
                                </Button>
                            </form>
                            {error && (
                                <p className="mt-3 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                    {error}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Output Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 px-1">Summary Result</h3>
                        
                        {!summary && !loading && (
                            <Card className="min-h-[300px] border-dashed border-2 border-gray-200 bg-gray-50 flex items-center justify-center relative shadow-none">
                                <div className="text-center p-8 max-w-sm">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                                        <Youtube className="w-8 h-8 text-red-400" />
                                    </div>
                                    <h4 className="text-gray-900 font-medium mb-2">No summary yet</h4>
                                    <p className="text-sm text-gray-500">
                                        Paste a video URL above and click summarize to see the AI magic happen. Note: The video must have closed captions enabled.
                                    </p>
                                </div>
                            </Card>
                        )}

                        {loading && (
                            <Card className="min-h-[300px] border-dashed border-2 border-red-200 bg-red-50/50 flex flex-col items-center justify-center shadow-none text-red-600 space-y-4">
                                <Loader2 className="w-10 h-10 animate-spin" />
                                <div className="text-center">
                                    <p className="font-medium animate-pulse">Extracting Transcript & Summarizing...</p>
                                    <p className="text-sm text-red-500/80 mt-1">This usually takes 5-10 seconds depending on the video length.</p>
                                </div>
                            </Card>
                        )}

                        {summary && !loading && (
                            <Card className="border-gray-200 shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Wand2 className="w-4 h-4 text-indigo-600" />
                                            <span className="font-semibold text-gray-900 text-sm">AI Generated Summary</span>
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
                                    <div className="p-6 md:p-8 prose prose-indigo max-w-none prose-sm sm:prose-base text-gray-700 leading-relaxed">
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
