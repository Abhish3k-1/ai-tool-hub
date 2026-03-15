'use client';

import { useAuth } from '@/lib/auth';
import {
    ArrowRight,
    Briefcase,
    FileText,
    FileType,
    Sparkles,
    Wand2,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, type MouseEvent } from 'react';

export default function Home() {
    const { user, loading, signInWithGoogle } = useAuth();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const tools = [
        {
            icon: FileText,
            title: 'Notes Saver',
            desc: 'Capture, organize, and revisit important notes with a clean writing flow.',
            color: 'from-emerald-400 to-teal-500',
            href: '/tools/notes',
            tag: 'Firestore',
        },
        {
            icon: Wand2,
            title: 'YouTube Summarizer',
            desc: 'Turn long videos into crisp highlights in seconds with AI-powered summaries.',
            color: 'from-rose-400 to-red-500',
            href: '/tools/youtube',
            tag: 'OpenRouter',
        },
        {
            icon: Briefcase,
            title: 'AI Job Search',
            desc: 'Discover relevant roles quickly with intelligent job matching and filters.',
            color: 'from-sky-400 to-blue-500',
            href: '/tools/job-search',
            tag: 'Firecrawl',
        },
        {
            icon: FileType,
            title: 'AI Resume Maker',
            desc: 'Build ATS-ready resumes with a polished workflow and one-click export.',
            color: 'from-sky-500 to-cyan-500',
            href: '/tools/resume',
            tag: 'Supabase',
        },
    ];

    const handleHeroMouseMove = (event: MouseEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
        setTilt({ x, y });
    };

    return (
        <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="animate-[float-soft_8s_ease-in-out_infinite] absolute left-[-18%] top-8 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="animate-[float-soft_10s_ease-in-out_infinite] absolute right-[-12%] top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="animate-[float-soft_9s_ease-in-out_infinite] absolute left-[40%] top-[-5%] h-52 w-52 rounded-full bg-sky-300/20 blur-3xl" />
            </div>

            <section
                className="glass-panel page-enter relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/45 via-white/10 to-sky-50/40" />

                <div
                    className="parallax-panel relative mx-auto grid max-w-6xl grid-cols-1 gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-center"
                    style={{ transform: `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)` }}
                >
                    <div className="text-center lg:text-left">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/85 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
                            <Sparkles className="h-4 w-4" />
                            AI Tools Hub
                        </div>

                        <h1 className="text-balance text-4xl font-black leading-[1.02] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                            Run your entire
                            <span className="block bg-gradient-to-r from-sky-700 via-cyan-600 to-blue-500 bg-clip-text text-transparent">
                                AI workflow in one place
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-[1.05rem]">
                            A polished workspace for summaries, job discovery, notes, and resume building with fast performance and focused UX.
                        </p>

                        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row lg:justify-start">
                            {!user && !loading ? (
                                <Button
                                    onClick={signInWithGoogle}
                                    className="cursor-glow-btn h-12 w-full rounded-2xl border border-slate-200 bg-white px-6 text-base font-semibold text-slate-900 shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-50 sm:w-auto"
                                >
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                                </Button>
                            ) : null}
                            <Link
                                href="/#tools"
                                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/85 px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/70"
                            >
                                Explore Tools
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="glass-card rounded-3xl p-4 sm:p-5">
                        <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-800">Workspace Signal</p>
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                                    <Zap className="h-3 w-3" />
                                    Ready
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                {tools.map((tool) => (
                                    <Link
                                        key={`hero-${tool.title}`}
                                        href={tool.href}
                                        className="group flex items-center justify-between rounded-xl border border-slate-200/70 bg-white px-3 py-2.5 transition-all hover:border-sky-200 hover:bg-sky-50/40"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color} text-white shadow-sm`}>
                                                <tool.icon className="h-4 w-4" />
                                            </span>
                                            <span className="text-sm font-medium text-slate-700">{tool.title}</span>
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-sky-600" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tools" className="page-enter mt-16">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Tools That Ship Work Faster
                        </h2>
                        <p className="mt-3 text-slate-600 sm:text-lg">
                            Purpose-built modules designed for real workflows, not demo screens.
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        4 Modules Live
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {tools.map((feature) => (
                        <Link
                            key={feature.title}
                            href={feature.href}
                            className="group hover-lift interactive-ripple glass-card relative overflow-hidden rounded-3xl p-6"
                        >
                            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`} />
                            </div>

                            <div className="relative flex items-start justify-between">
                                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-[0_10px_24px_rgba(15,23,42,0.18)]`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="rounded-full border border-slate-200 bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                    {feature.tag}
                                </span>
                            </div>

                            <h3 className="relative text-xl font-semibold text-slate-900">{feature.title}</h3>
                            <p className="relative mt-2 min-h-[64px] text-sm leading-relaxed text-slate-600">
                                {feature.desc}
                            </p>

                            <div className="relative mt-5 flex items-center text-sm font-semibold text-sky-700">
                                Open tool
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="page-enter mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                    {
                        title: 'Authenticate',
                        desc: 'Sign in securely with Google to unlock your full workspace.',
                        step: '01',
                    },
                    {
                        title: 'Select Tool',
                        desc: 'Jump into summaries, jobs, notes, or resume generation.',
                        step: '02',
                    },
                    {
                        title: 'Create Output',
                        desc: 'Generate polished results instantly and continue your flow.',
                        step: '03',
                    },
                ].map((item) => (
                    <div key={item.step} className="hover-lift glass-card rounded-2xl p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Step
                            </span>
                            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">
                                {item.step}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                ))}
            </section>

            <section className="page-enter mt-14">
                <div className="glass-panel overflow-hidden rounded-3xl p-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                                Built For Speed
                            </p>
                            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                One workspace, multiple AI outcomes
                            </h3>
                            <p className="mt-3 max-w-2xl text-slate-600">
                                Keep context, reduce tab switching, and ship faster with a single platform that connects your daily AI tasks.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-center">
                                <p className="text-2xl font-black text-slate-900">4</p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Core Tools</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-center">
                                <p className="text-2xl font-black text-slate-900">1</p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Unified Hub</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
