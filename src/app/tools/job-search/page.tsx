'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Job Search</h1>
                        <p className="text-gray-500 dark:text-gray-400">Find the most relevant roles curated for you.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Search Section */}
                    <Card className="border-blue-100 dark:border-blue-500/10 shadow-sm bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-950 dark:to-blue-950/10">
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
                                        className="pl-10 h-14 text-lg border-gray-200 focus-visible:ring-blue-500 bg-white dark:bg-gray-900"
                                    />
                                </div>
                                <Button 
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md shadow-blue-500/20 text-base"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                    {loading ? 'Searching...' : 'Find Jobs'}
                                </Button>
                            </form>
                            
                            {error && (
                                <p className="mt-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                    {error}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Results Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Search Results</h3>
                            {hasSearched && !loading && (
                                <span className="text-sm text-gray-500">Found {jobs.length} top matches</span>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <Card className="min-h-[300px] border-dashed border-2 border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center shadow-none text-blue-600 space-y-4">
                                <Loader2 className="w-10 h-10 animate-spin" />
                                <div className="text-center">
                                    <p className="font-medium animate-pulse">Scanning the web for the best opportunities...</p>
                                    <p className="text-sm text-blue-500/80 mt-1">This usually takes a few seconds.</p>
                                </div>
                            </Card>
                        )}

                        {/* Empty/Initial State */}
                        {!hasSearched && !loading && (
                            <Card className="min-h-[300px] border-dashed border-2 border-gray-200 bg-gray-50 flex items-center justify-center relative shadow-none">
                                <div className="text-center p-8 max-w-sm">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                                        <Briefcase className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h4 className="text-gray-900 font-medium mb-2">No searches yet</h4>
                                    <p className="text-sm text-gray-500">
                                        Enter a job title or keyword above and hit search to find open roles via Firecrawl AI.
                                    </p>
                                </div>
                            </Card>
                        )}

                        {/* No Jobs Found Status */}
                        {hasSearched && !loading && jobs.length === 0 && !error && (
                            <Card className="min-h-[200px] border border-gray-200 bg-gray-50 flex items-center justify-center">
                                <p className="text-gray-500 font-medium">No job postings found for "{query}". Try a broader term.</p>
                            </Card>
                        )}

                        {/* Results Grid */}
                        <div className="grid gap-4">
                            {!loading && jobs.map((job, i) => (
                                <Card key={i} className="hover:border-blue-300 dark:hover:border-blue-500/30 transition-all hover:shadow-md group">
                                    <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex shrink-0 items-center justify-center border border-gray-200 dark:border-gray-700">
                                            <Building2 className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="flex-grow space-y-2 w-full">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {job.title}
                                                    </h4>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
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
                                                <Button variant="outline" className="w-full sm:w-auto group-hover:bg-blue-50 border-gray-200 text-blue-600 font-medium">
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
