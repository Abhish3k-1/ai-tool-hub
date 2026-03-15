import { Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                            AI Tools Hub
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-8">
                        {["Privacy", "Terms", "Contact"].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} AI Tools Hub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
