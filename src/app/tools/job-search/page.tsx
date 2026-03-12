'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Briefcase, Search, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function JobSearchPage() {
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) return;

        setLoading(true);
        setTimeout(() => {
            setResults([
                { id: 1, title: 'Senior Frontend Engineer', company: 'TechCorp', location: 'Remote', type: 'Full-time' },
                { id: 2, title: 'React Developer', company: 'StartupX', location: 'New York, NY', type: 'Contract' },
                { id: 3, title: 'UX/UI Designer', company: 'Creative Agency', location: 'London, UK', type: 'Full-time' },
            ]);
            setLoading(false);
        }, 1500);
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">AI Job Search</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">
                        Find the perfect roles aggregated and optimized using Firecrawl API insights.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Job title, keywords, or company"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center min-w-[140px] gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Find Jobs</span>}
                    </button>
                </form>

                {results.length > 0 && (
                    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 px-2">Showing {results.length} matched results</h2>
                        {results.map(job => (
                            <div key={job.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-md transition-all group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{job.company}</span>
                                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                        <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">{job.type}</span>
                                    </div>
                                </div>
                                <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium transition-colors">
                                    View Role
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
