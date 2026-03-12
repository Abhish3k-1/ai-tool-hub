'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { FileType, FileText, Send, Loader2, Sparkles, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ResumeMakerPage() {
    const [loading, setLoading] = useState(false);
    const [generatedResume, setGeneratedResume] = useState<string | null>(null);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setGeneratedResume(`John Doe\nSoftware Engineer\n\nExperience:\n- Senior Developer at Tech Corp\n- Fullstack Engineer at Startup Inc\n\nEducation:\n- BS Computer Science\n\nSkills:\nReact, Next.js, Node.js, AI/ML Integrations`);
            setLoading(false);
        }, 2500);
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <FileType className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">AI Resume Maker</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">
                        Create professional, ATS-optimized resumes instantly using AI. Just fill in your details and let us do the rest.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Form Section */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                            <FileText className="w-5 h-5 text-purple-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Information</h2>
                        </div>
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills (comma separated)</label>
                                <textarea required rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none" placeholder="React, Next.js, TypeScript, TailwindCSS..." />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience</label>
                                    <button type="button" className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 hover:underline">
                                        <Plus className="w-3 h-3" /> Add explicitly
                                    </button>
                                </div>
                                <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none" placeholder="Describe your overall experience or paste existing resume..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Education</label>
                                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600" placeholder="BS Computer Science, University of Technology" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                Generate AI Resume
                            </button>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col min-h-[600px]">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Preview</h2>
                            {generatedResume && (
                                <button className="text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline">Download PDF</button>
                            )}
                        </div>

                        <div className="flex-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-8 overflow-y-auto">
                            {!generatedResume && !loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 text-center">
                                    <FileType className="w-16 h-16 mb-4 opacity-50" />
                                    <p>Your generated resume will appear here</p>
                                </div>
                            ) : loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-purple-600 dark:text-purple-400">
                                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                                    <p className="font-medium animate-pulse">Crafting your perfect resume...</p>
                                </div>
                            ) : (
                                <div className="animate-fade-in whitespace-pre-wrap font-serif text-gray-800 dark:text-gray-200 leading-relaxed">
                                    {generatedResume}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
