'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch by only rendering after mount
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-10 w-10 rounded-xl border border-sky-100 bg-white/90 p-2.5 opacity-0 md:flex hidden" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 bg-white/90 text-slate-700 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50/70 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
            
            {/* Tooltip-like glow effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-sky-400/0 transition-all group-hover:bg-sky-400/5 dark:group-hover:bg-sky-400/10" />
        </button>
    );
}
