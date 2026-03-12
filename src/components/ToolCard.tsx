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
    colorClass = "text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
}: ToolCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <div className="h-full relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-4 opacity-0 -translate-y-4 translate-x-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>

                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm", colorClass)}>
                    <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {description}
                </p>

                {/* Decorative subtle background gradient on hover */}
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </Link>
    );
}
