'use client';

import { useAuth } from '@/lib/auth';
import { ArrowRight, Sparkles, Wand2, Briefcase, FileText, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();


    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-white">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 -z-10" />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-medium text-sm mb-8 border border-indigo-200/50 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Tools Hub</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6 max-w-4xl">
                    Do great work with <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                        Intelligent AI Tools
                    </span>
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
                    Boost your productivity with a suite of AI-powered tools designed to help you summarize videos, generate resumes, search jobs, and organize notes — all in one platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {!user && !loading ? (
                        <Button
                            onClick={signInWithGoogle}
                            className="h-14 px-8 text-lg rounded-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Sign in with Google
                        </Button>
                    ) : user ? (
                        <Link href="/dashboard">
                            <Button className="h-14 px-8 text-lg rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 group">
                                <LayoutDashboard className="mr-2 w-5 h-5" /> Go to Dashboard
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    ) : null}
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Everything you need to <span className="text-indigo-600">build faster</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Stop jumping between dozens of tabs. We've consolidated the most essential AI tools into a single, blazing-fast platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
                    {[
                        { icon: FileText, title: 'Notes Saver', desc: 'You can store and organize AI-generated notes securely.', color: 'from-emerald-400 to-emerald-600' },
                        { icon: Wand2, title: 'YouTube Summarizer', desc: 'Instantly generate summaries from any YouTube video.', color: 'from-red-400 to-red-600' },
                        { icon: Briefcase, title: 'AI Job Search', desc: 'Discover relevant job opportunities using AI-powered search.', color: 'from-blue-400 to-blue-600' },
                        { icon: FileText, title: 'AI Resume Maker', desc: 'Create professional ATS-friendly resumes in seconds.', color: 'from-purple-400 to-purple-600' },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="group relative bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-gray-200`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- HOW IT WORKS / STEPS --- */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col items-center max-w-3xl mx-auto space-y-8 text-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                            Designed for <br className="hidden md:block" />maximum efficiency
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Everything you need is just a click away. We removed the clutter so you can focus on what matters.
                        </p>
                    </div>

                    <div className="space-y-6 w-full max-w-xl text-left">
                        {[
                            "Sign in swiftly with Google Authentication",
                            "Select any AI tool from your unified dashboard",
                            "Generate, save, and export your results instantly"
                        ].map((text, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                                <span className="font-medium text-gray-900">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
