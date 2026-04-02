"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthButton from "@/components/AuthButton";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, role } = useAuth();
    const pathname = usePathname();

    const isLandingPage = pathname === "/";

    return (
        <nav className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-[0_10px_28px_rgba(3,105,161,0.3)] transition-all duration-200 group-hover:scale-[1.04] group-hover:shadow-[0_14px_32px_rgba(3,105,161,0.38)]">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight sm:text-xl bg-gradient-to-r from-sky-700 to-cyan-600 bg-clip-text text-transparent">
                        AI Tools Hub
                    </span>
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/85 p-1.5 shadow-sm">
                    {user && !isLandingPage && (
                        <>
                            <Link
                                href="/dashboard"
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-sky-50 hover:text-slate-900"
                            >
                                Dashboard
                            </Link>
                            {role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="rounded-xl px-4 py-2 text-sm font-semibold text-purple-600 transition-all hover:bg-purple-50 hover:text-purple-700"
                                >
                                    Admin
                                </Link>
                            )}
                        </>
                    )}
                    <AuthButton />
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2.5 rounded-xl border border-sky-100 bg-white/90 text-slate-700 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50/70"
                >
                    {mobileOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-sky-100/80 bg-white/95 backdrop-blur-xl page-enter">
                    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-4 sm:px-6">
                        {user && !isLandingPage && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50/70"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                {role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm font-semibold text-purple-700 shadow-sm transition-all hover:border-purple-200 hover:bg-purple-50/70"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                )}
                            </>
                        )}
                        <div className="pt-2 border-t border-sky-100/80">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
