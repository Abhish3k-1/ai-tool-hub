'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ToolCard from '@/components/ToolCard';
import { useAuth } from '@/lib/auth';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    ArrowUpRight,
    Briefcase,
    Clock3,
    FileText,
    FileType,
    FolderOpen,
    ShieldCheck,
    Sparkles,
    Youtube,
    Zap,
} from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const firstName = user?.displayName?.split(' ')[0] || 'Builder';
    const [hasGeneratedResume, setHasGeneratedResume] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchResumeStatus = async () => {
            if (!user?.uid) {
                if (isMounted) setHasGeneratedResume(false);
                return;
            }

            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('resume')
                    .select('id')
                    .eq('user_id', user.uid)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (!isMounted) return;

                if (error) {
                    console.error('Failed to check resume status:', error);
                    setHasGeneratedResume(false);
                    return;
                }

                setHasGeneratedResume(!!data);
            } catch (error) {
                console.error('Failed to check resume status:', error);
                if (isMounted) setHasGeneratedResume(false);
            }
        };

        fetchResumeStatus();

        return () => {
            isMounted = false;
        };
    }, [user?.uid]);

    const overviewStats = [
        {
            value: '4',
            label: 'Active Tools',
            helper: 'Notes, YouTube, Job Search, Resume',
            icon: Sparkles,
            accent: 'from-sky-500 to-cyan-500',
        },
        {
            value: '100%',
            label: 'Workspace Ready',
            helper: 'All core modules available',
            icon: ShieldCheck,
            accent: 'from-emerald-500 to-teal-500',
        },
        {
            value: 'Fast',
            label: 'Flow Speed',
            helper: 'Optimized for quick execution',
            icon: Zap,
            accent: 'from-amber-500 to-orange-500',
        },
        {
            value: 'Today',
            label: 'Last Login',
            helper: 'Secure Google authentication active',
            icon: Clock3,
            accent: 'from-sky-600 to-blue-500',
        },
    ];

    const quickActions = [
        { href: '/tools/notes', label: 'Open Notes Saver', icon: FileText },
        { href: '/tools/youtube', label: 'Summarize a Video', icon: Youtube },
        { href: '/tools/job-search', label: 'Find New Jobs', icon: Briefcase },
        { href: '/tools/resume', label: 'Build a Resume', icon: FileType },
    ];

    return (
        <ProtectedRoute>
            <div className="relative mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute left-[-14%] top-[-5%] h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
                    <div className="absolute right-[-10%] top-16 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
                </div>

                <section className="glass-panel page-enter relative overflow-hidden rounded-3xl p-6 sm:p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-white/10 to-sky-100/35" />
                    <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                                <Sparkles className="h-4 w-4" />
                                Overview
                            </div>

                            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl xl:text-5xl">
                                Welcome back, {firstName}.
                            </h1>
                            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                                Your AI workspace is ready. Jump into your next workflow, launch a tool, and ship faster with one clean control center.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/tools/resume"
                                    className="cursor-glow-btn inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(3,105,161,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(3,105,161,0.44)]"
                                >
                                    Build Resume
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/tools/notes"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/70"
                                >
                                    Open Notes
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/tools/resume/my-resume"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/70"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    {hasGeneratedResume ? 'My Resume' : 'No Resume Generated'}
                                </Link>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-4 sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Quick Actions
                            </p>
                            <div className="mt-3 space-y-2">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        className="group flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-sky-200 hover:bg-white"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-sky-100 group-hover:text-sky-700">
                                                <action.icon className="h-4 w-4" />
                                            </span>
                                            {action.label}
                                        </span>
                                        <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-600" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {overviewStats.map((stat) => (
                        <div key={stat.label} className="hover-lift glass-card rounded-2xl p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        {stat.label}
                                    </p>
                                    <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                                        {stat.value}
                                    </p>
                                </div>
                                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${stat.accent}`}>
                                    <stat.icon className="h-5 w-5" />
                                </span>
                            </div>
                            <p className="mt-3 text-sm text-slate-600">{stat.helper}</p>
                        </div>
                    ))}
                </section>

                <section className="mt-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Your Tools</h2>
                        <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Productivity Suite
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
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
                            colorClass="text-rose-600 bg-rose-50"
                        />
                        <ToolCard
                            title="AI Job Search"
                            description="Find the perfect role matching your skills with deep employment insights."
                            href="/tools/job-search"
                            icon={Briefcase}
                            colorClass="text-sky-600 bg-sky-50"
                        />
                        <ToolCard
                            title="AI Resume Maker"
                            description="Craft a professional, ATS-friendly resume tailored to job descriptions."
                            href="/tools/resume"
                            icon={FileType}
                            colorClass="text-cyan-600 bg-cyan-50"
                        />
                    </div>
                </section>
            </div>
        </ProtectedRoute>
    );
}
