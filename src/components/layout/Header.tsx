"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthButton from "@/components/AuthButton";
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
        <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="group flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-[0_10px_28px_rgba(3,105,161,0.28)] transition-all duration-200 group-hover:scale-[1.04] group-hover:shadow-[0_14px_32px_rgba(3,105,161,0.36)]">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-sky-700 to-cyan-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl">
                        AI Tools Hub
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 rounded-2xl border border-sky-100/80 bg-white/90 p-1.5 shadow-sm md:flex">
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
                                        ? (isAdmin ? "bg-purple-100/80 text-purple-900" : "bg-sky-100/80 text-slate-900")
                                        : (isAdmin ? "text-purple-600 hover:bg-purple-50 hover:text-purple-900" : "text-slate-600 hover:bg-sky-50 hover:text-slate-900")
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                        <AuthButton />
                    </div>

                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="rounded-xl border border-sky-100 bg-white/90 p-2.5 text-slate-700 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50/70 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="page-enter border-t border-sky-100/80 bg-white/95 backdrop-blur-xl md:hidden">
                    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-4 sm:px-6">
                        {navLinks.map((link) => {
                            const isAdmin = link.href === "/admin";
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition-all text-slate-700",
                                        isAdmin
                                            ? "border-purple-100 bg-white hover:border-purple-200 hover:bg-purple-50/70"
                                            : "border-sky-100 bg-white hover:border-sky-200 hover:bg-sky-50/70"
                                    )}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="border-t border-sky-100/80 pt-2">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
