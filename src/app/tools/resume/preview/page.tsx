"use client";

import ResumePreview from "@/components/ResumePreview";
import { FileType } from "lucide-react";

export default function PreviewPage() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            <div className="glass-panel mb-8 rounded-3xl p-5 sm:p-7">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 shadow-sm">
                        <FileType className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            Your Resume is Ready
                        </h1>
                        <p className="text-slate-600">
                            Review your AI-generated resume below and download it as PDF.
                        </p>
                    </div>
                </div>
            </div>

            <ResumePreview />
        </div>
    );
}
