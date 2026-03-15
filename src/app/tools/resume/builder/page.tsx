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
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <FileType className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {generatedHtml ? "Your Resume is Ready" : "Resume Builder"}
                            </h1>
                            <p className="text-gray-500">
                                {generatedHtml
                                    ? "Review your AI-generated resume below and download it as PDF."
                                    : "Fill in your details and let AI craft the perfect resume for you."}
                            </p>
                        </div>
                    </div>
                    {/* My Resume button in the header */}
                    <Link
                        href="/tools/resume/my-resume"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-all"
                    >
                        <FolderOpen className="h-4 w-4" />
                        My Resume
                    </Link>
                </div>

                {/* Template indicator */}
                {template && !generatedHtml && (
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                            <div
                                className="h-3 w-3 rounded-full"
                                style={{ background: template.color }}
                            />
                            <span className="text-gray-500">
                                Template:{" "}
                                <span className="font-semibold text-gray-900">
                                    {template.name}
                                </span>
                            </span>
                        </div>
                        <Link
                            href="/tools/resume/templates"
                            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
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
