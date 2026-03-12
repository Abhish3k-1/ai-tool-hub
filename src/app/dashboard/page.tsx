'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ToolCard from '@/components/ToolCard';
import { useAuth } from '@/lib/auth';
import { FileText, Youtube, Briefcase, FileType } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in">
                <div className="mb-12 space-y-4 max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Welcome back, {user?.displayName?.split(' ')[0] || 'User'}! 🚀
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed">
                        What would you like to build or discover today? Explore your personalized AI toolkit below.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
                    <ToolCard
                        title="Notes Saver"
                        description="Create, organize, and securely store your personal AI-generated notes with cloud synchronization."
                        href="/tools/notes"
                        icon={FileText}
                        colorClass="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                    />
                    <ToolCard
                        title="YouTube Summarizer"
                        description="Instantly generate comprehensive summaries and key takeaways from any YouTube video link."
                        href="/tools/youtube-summarizer"
                        icon={Youtube}
                        colorClass="text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 transition-colors"
                    />
                    <ToolCard
                        title="AI Job Search"
                        description="Find the perfect role matching your skills. Powered by Firecrawl for deep employment insights."
                        href="/tools/job-search"
                        icon={Briefcase}
                        colorClass="text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                    />
                    <ToolCard
                        title="AI Resume Maker"
                        description="Craft a professional, ATS-friendly resume tailored to job descriptions in seconds."
                        href="/tools/resume-maker"
                        icon={FileType}
                        colorClass="text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400 hover:bg-purple-100 transition-colors"
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}
