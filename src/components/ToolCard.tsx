import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    colorClass?: string;
}

export default function ToolCard({
    title,
    description,
    href,
    icon: Icon,
    colorClass = 'text-blue-500 bg-blue-50',
}: ToolCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <div className="hover-lift interactive-ripple relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/82 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.07)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/45 via-sky-50/30 to-cyan-50/25" />
                </div>

                <div className={cn('relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1 ring-white/80 transition-transform duration-200 group-hover:scale-110', colorClass)}>
                    <Icon className="h-6 w-6" />
                </div>

                <h3 className="relative mb-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-sky-700">
                    {title}
                </h3>

                <p className="relative flex-grow text-sm leading-relaxed text-slate-600">
                    {description}
                </p>

                <div className="relative mt-6 flex items-center text-sm font-semibold text-sky-700 opacity-90 transition-opacity group-hover:opacity-100">
                    Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>

                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
        </Link>
    );
}
