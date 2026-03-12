'use client';

import Link from 'next/link';
import AuthButton from './AuthButton';
import { Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-1.5 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        AI Tools
                    </span>
                </Link>

                {user && (
                    <nav className="hidden md:flex items-center gap-6 ml-10 flex-1">
                        <Link
                            href="/dashboard"
                            className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/dashboard' || pathname.startsWith('/tools')
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            Dashboard
                        </Link>
                    </nav>
                )}

                <div className="flex items-center gap-4 ml-auto">
                    <AuthButton />
                </div>
            </div>
        </header>
    );
}
