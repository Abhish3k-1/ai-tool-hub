'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Youtube, Briefcase, FileType } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { href: '/tools/notes', icon: FileText, label: 'Notes Saver', color: 'text-emerald-500' },
        { href: '/tools/youtube', icon: Youtube, label: 'YouTube Summarizer', color: 'text-red-500' },
        { href: '/tools/job-search', icon: Briefcase, label: 'AI Job Search', color: 'text-blue-500' },
        { href: '/tools/resume', icon: FileType, label: 'AI Resume Maker', color: 'text-purple-500' },
    ];

    return (
        <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
            <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                    Menu
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive && item.color ? item.color : ''}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Account Area (Optional) */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="px-3 py-2 text-sm text-gray-500">
                    AI Tools Hub v1.0
                </div>
            </div>
        </aside>
    );
}
