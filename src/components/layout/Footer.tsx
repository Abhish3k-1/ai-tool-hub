import Link from "next/link";
import { Sparkles, Github, Twitter, Mail } from "lucide-react";

const productLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workspace", href: "/tools/notes" },
    { label: "Pricing", href: "#" },
];

const toolLinks = [
    { label: "Notes Saver", href: "/tools/notes" },
    { label: "YouTube Summarizer", href: "/tools/youtube" },
    { label: "AI Research", href: "/tools/ai-research" },
];

const contactLinks = [
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
];

export default function Footer() {
    return (
        <footer className="border-t border-sky-100/80 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
                <div className="glass-panel grid gap-8 rounded-3xl px-6 py-7 md:grid-cols-4 md:px-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-[0_8px_24px_rgba(3,105,161,0.3)]">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-sky-700 to-cyan-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                                AI Tools Hub
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            A modern AI workspace for summaries, web research, and notes.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Product</h3>
                        <ul className="mt-3 space-y-2">
                            {productLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Tools</h3>
                        <ul className="mt-3 space-y-2">
                            {toolLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Contact</h3>
                        <ul className="mt-3 space-y-2">
                            {contactLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex items-center gap-2">
                            {[Github, Twitter, Mail].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/85 text-slate-500 transition-all hover:-translate-y-0.5 hover:text-slate-900"
                                    aria-label="Social link"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} AI Tools Hub. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
