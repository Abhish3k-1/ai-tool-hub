'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ToolCard from '@/components/ToolCard';
import { useAuth } from '@/lib/auth';
import { FileText, Youtube, Briefcase, FileType } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="container mx-auto px-4 py-8 max-w-7xl">

                    {/* Header Section */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Overview
                        </h1>
                        <p className="text-gray-500 text-lg mt-1">
                            Welcome back, <span className="text-gray-900 font-medium">{user?.displayName?.split(' ')[0] || 'Builder'}</span>.
                        </p>
                    </div>

                    {/* Tools Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Tools</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ToolCard
                                title="Notes Saver"
                                description="Create, organize, and securely store your personal AI-generated notes."
                                href="/tools/notes"
                                icon={FileText}
                                colorClass="text-emerald-600 bg-emerald-50"
                            />
                            <ToolCard
                                title="YouTube Summarizer"
                                description="Instantly generate comprehensive summaries from any YouTube video link."
                                href="/tools/youtube"
                                icon={Youtube}
                                colorClass="text-red-600 bg-red-50"
                            />
                            <ToolCard
                                title="AI Job Search"
                                description="Find the perfect role matching your skills with deep employment insights."
                                href="/tools/job-search"
                                icon={Briefcase}
                                colorClass="text-blue-600 bg-blue-50"
                            />
                            <ToolCard
                                title="AI Resume Maker"
                                description="Craft a professional, ATS-friendly resume tailored to job descriptions."
                                href="/tools/resume"
                                icon={FileType}
                                colorClass="text-purple-600 bg-purple-50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
