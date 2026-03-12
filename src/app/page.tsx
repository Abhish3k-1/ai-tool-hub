'use client';

import { useAuth } from '@/lib/auth';
import { ArrowRight, Sparkles, Wand2, Briefcase, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-900/20 dark:via-gray-950 dark:to-gray-950 -z-10" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      <div className="max-w-4xl mx-auto text-center space-y-8 z-10 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-sm mb-4 border border-blue-200 dark:border-blue-500/20 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>All your AI tools in one unified workspace</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Supercharge your workflow with <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Intelligent Tools
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          Access a powerful suite of AI-driven applications including intelligent notes, precise YouTube summarization, automated job search, and professional resume building—all from a single dashboard.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {!user && !loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium bg-white/50 dark:bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 backdrop-blur-sm shadow-sm">
              Sign in from the top corner to get started <ArrowRight className="w-4 h-4" />
            </p>
          )}
        </div>

        {/* Feature Highlights display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-16">
          {[
            { icon: FileText, label: 'Smart Notes', delay: '0' },
            { icon: Wand2, label: 'Video Summaries', delay: '100' },
            { icon: Briefcase, label: 'Job Search', delay: '200' },
            { icon: FileText, label: 'Resume Builder', delay: '300' },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-4 bg-white/40 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-inset ring-blue-500/10">
                <feature.icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-200">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
