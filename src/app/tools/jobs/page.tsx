'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Briefcase, Search, MapPin, Building2, ExternalLink, Clock } from 'lucide-react';

export default function JobSearchPage() {
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
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Job title, keywords, or company..."
                                        className="pl-10 h-14 text-lg border-gray-200 focus-visible:ring-blue-500"
                                    />
                                </div>
                                <div className="relative flex-grow md:max-w-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Location or Remote"
                                        className="pl-10 h-14 text-base border-gray-200 focus-visible:ring-blue-500"
                                    />
                                </div>
                                <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md shadow-blue-500/20 text-base">
                                    Find Jobs
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Section */}
                    <div>
                        <div className="flex justify-between items-end mb-4 px-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recommended Roles</h3>
                            <span className="text-sm text-gray-500">Showing top matches</span>
                        </div>

                        <div className="grid gap-4">
                            {/* Placeholder Job Cards */}
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="hover:border-blue-300 dark:hover:border-blue-500/30 transition-all hover:shadow-md cursor-pointer group">
                                    <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex shrink-0 items-center justify-center border border-gray-200 dark:border-gray-700">
                                            <Building2 className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="flex-grow space-y-2 w-full">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        Senior Frontend Engineer
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">TechCorp Inc.</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        $120k - $160k
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> San Francisco, CA (Remote)</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Posted 2 days ago</span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {['React', 'TypeScript', 'Next.js'].map(skill => (
                                                    <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                            <Button variant="outline" className="w-full sm:w-auto group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 border-gray-200 dark:border-gray-700">
                                                View Details <ExternalLink className="ml-2 w-4 h-4" />
                                            </Button>
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
