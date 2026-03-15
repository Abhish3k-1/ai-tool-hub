"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthButton from "@/components/AuthButton";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const pathname = usePathname();

    const isLandingPage = pathname === "/";

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20 transition-shadow group-hover:shadow-indigo-500/30">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        AI Tools Hub
                    </span>
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    {user && !isLandingPage && (
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            Dashboard
                        </Link>
                    )}
                    <AuthButton />
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {mobileOpen ? (
                        <X className="h-5 w-5 text-gray-600" />
                    ) : (
                        <Menu className="h-5 w-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="flex flex-col gap-2 px-6 py-4">
                        {user && !isLandingPage && (
                            <Link
                                href="/dashboard"
                                className="px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                                onClick={() => setMobileOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                        <div className="pt-2 border-t border-gray-100">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
