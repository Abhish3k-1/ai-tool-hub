"use client";

import { useResume } from "@/context/ResumeContext";
import BuilderForm from "@/components/BuilderForm";
import ResumePreview from "@/components/ResumePreview";
import AnimatedLoader from "@/components/AnimatedLoader";
import Link from "next/link";
import { FileType, LayoutTemplate, FolderOpen } from "lucide-react";
import { getTemplateById } from "@/lib/templates";

export default function BuilderPage() {
    const { isGenerating, selectedTemplateId, generatedHtml } = useResume();
    const template = getTemplateById(selectedTemplateId);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
            <div className="glass-panel mb-8 rounded-3xl p-5 sm:p-7">
                <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 shadow-sm">
                            <FileType className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                {generatedHtml ? "Your Resume is Ready" : "Resume Builder"}
                            </h1>
                            <p className="text-slate-600">
                                {generatedHtml
                                    ? "Review your AI-generated resume below and download it as PDF."
                                    : "Fill in your details and let AI craft the perfect resume for you."}
                            </p>
                        </div>
                    </div>
                    {/* My Resume button in the header */}
                    <Link
                        href="/tools/resume/my-resume"
                        className="flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition-all hover:-translate-y-0.5 hover:bg-sky-100"
                    >
                        <FolderOpen className="h-4 w-4" />
                        My Resume
                    </Link>
                </div>

                {/* Template indicator */}
                {template && !generatedHtml && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-1.5 text-sm shadow-sm">
                            <div
                                className="h-3 w-3 rounded-full"
                                style={{ background: template.color }}
                            />
                            <span className="text-slate-600">
                                Template:{" "}
                                <span className="font-semibold text-slate-900">
                                    {template.name}
                                </span>
                            </span>
                        </div>
                        <Link
                            href="/tools/resume/templates"
                            className="flex items-center gap-1 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-900"
                        >
                            <LayoutTemplate className="h-3.5 w-3.5" />
                            Change
                        </Link>
                    </div>
                )}
            </div>

            {isGenerating ? (
                <AnimatedLoader />
            ) : generatedHtml ? (
                <ResumePreview />
            ) : (
                <BuilderForm />
            )}
        </div>
    );
}
