"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthButton from "@/components/AuthButton";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const baseLinks = [
    { href: "/", label: "Home" },
    { href: "/#tools", label: "Tools" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { user, role } = useAuth();

    let navLinks = baseLinks;
    if (user) {
        navLinks = [...navLinks, { href: "/dashboard", label: "Dashboard" }];
        if (role === 'admin') {
            navLinks = [...navLinks, { href: "/admin", label: "Admin" }];
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/75 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/75">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="group flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-[0_10px_28px_rgba(3,105,161,0.28)] transition-all duration-200 group-hover:scale-[1.04] group-hover:shadow-[0_14px_32px_rgba(3,105,161,0.36)] dark:from-sky-600 dark:to-cyan-600">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-sky-700 to-cyan-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent dark:from-sky-400 dark:to-cyan-300 sm:text-xl">
                        AI Tools Hub
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 rounded-2xl border border-sky-100/80 bg-white/90 p-1.5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/80 md:flex">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href === "/" && pathname === "/");
                        const isAdmin = link.href === "/admin";

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                                    isActive
                                        ? (isAdmin ? "bg-purple-100/80 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200" : "bg-sky-100/80 text-slate-900 dark:bg-sky-900/30 dark:text-sky-100")
                                        : (isAdmin ? "text-purple-600 hover:bg-purple-50 hover:text-purple-900 dark:text-purple-400 dark:hover:bg-purple-900/20" : "text-slate-600 hover:bg-sky-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-sky-900/20")
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <div className="hidden md:block">
                        <AuthButton />
                    </div>

                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="rounded-xl border border-sky-100 bg-white/90 p-2.5 text-slate-700 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50/70 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="page-enter border-t border-sky-100/80 bg-white/95 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/95 md:hidden">
                    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-4 sm:px-6">
                        {navLinks.map((link) => {
                            const isAdmin = link.href === "/admin";
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition-all text-slate-700 dark:text-slate-200",
                                        isAdmin
                                            ? "border-purple-100 bg-white hover:border-purple-200 hover:bg-purple-50/70 dark:border-purple-900/50 dark:bg-slate-900 dark:hover:bg-purple-950/30"
                                            : "border-sky-100 bg-white hover:border-sky-200 hover:bg-sky-50/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                                    )}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="border-t border-sky-100/80 pt-2 dark:border-slate-800/80">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
