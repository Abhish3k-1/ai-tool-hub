"use client";

import ResumePreview from "@/components/ResumePreview";
import DeleteResumeButton from "@/components/DeleteResumeButton";
import Link from "next/link";
import { FileType, FileText } from "lucide-react";

export default function PreviewPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                        <FileType className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Your Resume is Ready
                        </h1>
                        <p className="text-gray-500">
                            Review your AI-generated resume below and download it as PDF.
                        </p>
                    </div>
                </div>
            </div>

            <ResumePreview />
        </div>
    );
}
