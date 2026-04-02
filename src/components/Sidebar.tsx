'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Youtube, Globe, Sparkles, Search, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export default function Sidebar() {
    const pathname = usePathname();
    const { role } = useAuth();
    const [expanded, setExpanded] = useState(false);

    const menuItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', mobileLabel: 'Overview', color: 'text-sky-500' },
        { href: '/tools/notes', icon: FileText, label: 'Notes Saver', mobileLabel: 'Notes', color: 'text-emerald-500' },
        { href: '/tools/youtube', icon: Youtube, label: 'YouTube Summarizer', mobileLabel: 'YouTube', color: 'text-rose-500' },
        { href: '/tools/ai-research', icon: Globe, label: 'AI Research', mobileLabel: 'Research', color: 'text-sky-500' },
    ];

    if (role === 'admin') {
        menuItems.push({ href: '/admin', icon: ShieldCheck, label: 'Admin Panel', mobileLabel: 'Admin', color: 'text-purple-500' });
    }

    return (
        <>
            <aside
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                className={cn(
                    'relative hidden shrink-0 self-start transition-[width] duration-300 ease-out md:sticky md:top-3 md:block',
                    expanded ? 'w-72' : 'w-[7.5rem]'
                )}
            >
                <div className="px-2.5 py-3">
                    <div
                        className={cn(
                            'glass-panel flex min-h-[calc(100vh-2.25rem)] flex-col rounded-3xl transition-all duration-300',
                            expanded ? 'p-3' : 'p-2.5'
                        )}
                    >
                        <div
                            className={cn(
                                'mb-2 flex border-b border-sky-100/80 pb-3',
                                expanded ? 'items-center gap-2 px-2' : 'justify-center px-1'
                            )}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_6px_18px_rgba(3,105,161,0.28)]">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <span
                                className={cn(
                                    'overflow-hidden whitespace-nowrap text-sm font-semibold text-slate-700 transition-all duration-200',
                                    expanded ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'
                                )}
                            >
                                Workspace
                            </span>
                        </div>

                        <div className={cn('flex-1 space-y-1', expanded ? 'pr-1' : 'pr-0')}>
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'group relative flex items-center rounded-2xl py-2.5 text-sm font-semibold transition-all duration-200',
                                            expanded ? 'gap-3 px-2.5' : 'justify-center px-1.5',
                                            isActive
                                                ? 'bg-gradient-to-r from-sky-500/15 to-cyan-500/10 text-slate-900 ring-1 ring-sky-200/70'
                                                : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white/75 transition-all',
                                                isActive && 'border-sky-100 bg-white shadow-sm'
                                            )}
                                        >
                                            <item.icon className={cn('h-[18px] w-[18px]', item.color)} />
                                        </span>
                                        <span
                                            className={cn(
                                                'overflow-hidden whitespace-nowrap transition-all duration-200',
                                                expanded ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-2 border-t border-sky-100/80 px-2 pt-3 text-xs font-medium text-slate-500">
                            <span className={cn('overflow-hidden whitespace-nowrap transition-all duration-200', expanded ? 'inline-block max-w-[180px] opacity-100' : 'inline-block max-w-0 opacity-0')}>
                                AI Tools Hub v1.0
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto w-[calc(100%-1rem)] max-w-md rounded-2xl border border-sky-100/80 bg-white/90 p-2 shadow-[0_12px_28px_rgba(8,47,73,0.14)] backdrop-blur-xl md:hidden">
                <div className={cn("grid gap-1", role === 'admin' ? "grid-cols-5" : "grid-cols-4")}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-all',
                                    isActive
                                        ? 'bg-sky-100/80 text-slate-900 ring-1 ring-sky-200'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                )}
                            >
                                <item.icon className={cn('h-4 w-4', item.color)} />
                                <span className="block w-full truncate text-center leading-tight">
                                    {item.mobileLabel}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

