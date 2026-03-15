import { Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-sky-100/80 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
                <div className="glass-panel flex flex-col items-center gap-6 rounded-3xl px-6 py-7 md:flex-row md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-[0_8px_24px_rgba(3,105,161,0.3)]">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-sky-700 to-cyan-600 bg-clip-text text-transparent">
                            AI Tools Hub
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
                        {["Privacy", "Terms", "Contact"].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} AI Tools Hub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
