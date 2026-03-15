'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Briefcase, Search, ExternalLink, Loader2, Building2 } from 'lucide-react';

interface Job {
    title: string;
    description: string;
    url: string;
}

export default function JobSearchPage() {
    const [query, setQuery] = useState('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!query.trim()) {
            setError('Please enter a job title or keyword to search.');
            return;
        }

        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const response = await fetch('/api/tools/job-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch jobs');
            }

            setJobs(data.jobs || []);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 page-enter">
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 shadow-sm">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">AI Job Search</h1>
                        <p className="text-slate-600">Find the most relevant roles curated for you.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Search Section */}
                    <Card className="border-sky-200/80 bg-gradient-to-br from-white to-sky-50/60 shadow-sm">
                        <CardContent className="pt-6">
                            <form 
                                onSubmit={handleSearch}
                                className="flex flex-col md:flex-row gap-4"
                            >
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Job title, keywords, or company..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="h-14 bg-white pl-10 text-lg"
                                    />
                                </div>
                                <Button 
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="h-14 gap-2 bg-gradient-to-r from-sky-600 to-blue-600 px-8 text-base text-white"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                    {loading ? 'Searching...' : 'Find Jobs'}
                                </Button>
                            </form>
                            
                            {error && (
                                <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                                    {error}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Results Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <h3 className="text-xl font-semibold text-slate-900">Search Results</h3>
                            {hasSearched && !loading && (
                                <span className="text-sm text-slate-500">Found {jobs.length} top matches</span>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <Card className="flex min-h-[300px] flex-col items-center justify-center space-y-4 border-dashed border-2 border-sky-200 bg-sky-50/70 text-sky-700 shadow-none">
                                <Loader2 className="w-10 h-10 animate-spin" />
                                <div className="text-center">
                                    <p className="font-medium animate-pulse">Scanning the web for the best opportunities...</p>
                                    <p className="mt-1 text-sm text-sky-600/80">This usually takes a few seconds.</p>
                                </div>
                            </Card>
                        )}

                        {/* Empty/Initial State */}
                        {!hasSearched && !loading && (
                            <Card className="relative flex min-h-[300px] items-center justify-center border-dashed border-2 border-slate-200 bg-slate-50 shadow-none">
                                <div className="text-center p-8 max-w-sm">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                                        <Briefcase className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h4 className="mb-2 font-medium text-slate-900">No searches yet</h4>
                                    <p className="text-sm text-slate-500">
                                        Enter a job title or keyword above and hit search to find open roles via Firecrawl AI.
                                    </p>
                                </div>
                            </Card>
                        )}

                        {/* No Jobs Found Status */}
                        {hasSearched && !loading && jobs.length === 0 && !error && (
                            <Card className="flex min-h-[200px] items-center justify-center border border-slate-200 bg-slate-50">
                                <p className="font-medium text-slate-500">No job postings found for &quot;{query}&quot;. Try a broader term.</p>
                            </Card>
                        )}

                        {/* Results Grid */}
                        <div className="grid gap-4">
                            {!loading && jobs.map((job, i) => (
                                <Card key={i} className="group transition-all hover:border-sky-300 hover:shadow-md">
                                    <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
                                            <Building2 className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <div className="flex-grow space-y-2 w-full">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-sky-700">
                                                        {job.title}
                                                    </h4>
                                                </div>
                                            </div>
                                            <p className="line-clamp-2 text-sm text-slate-600">
                                                {job.description}
                                            </p>
                                        </div>
                                        <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                            <a 
                                                href={job.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block w-full sm:w-auto"
                                            >
                                                <Button variant="outline" className="w-full sm:w-auto border-slate-200 font-semibold text-sky-700 group-hover:bg-sky-50">
                                                    View Job <ExternalLink className="ml-2 w-4 h-4" />
                                                </Button>
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
