"use client";

import { useResume } from "@/context/ResumeContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, ArrowLeft, LayoutTemplate, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/components/Toast";
import { generateResumePdf } from "@/lib/resume-pdf";

export default function ResumePreview() {
    const { generatedHtml, setGeneratedHtml } = useResume();
    const router = useRouter();
    const { showToast } = useToast();
    const resumeRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (isDownloading) return;

        // Ensure the HTML content exists before generating the PDF.
        if (!generatedHtml || !generatedHtml.trim()) {
            showToast("No resume content to download. Please generate a resume first.", "error");
            return;
        }

        const previewElement = resumeRef.current;
        if (!previewElement) {
            showToast("Resume preview is not ready yet. Please try again.", "error");
            return;
        }

        setIsDownloading(true);

        try {
            // Ensure any pending renders are complete
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            
            await generateResumePdf({ element: previewElement, fileName: "resume.pdf" });
            showToast("Resume PDF downloaded successfully.", "success");
        } catch (error: any) {
            console.error("PDF generation failed:", error);
            showToast(
                error.message || "Sorry, we couldn't generate your PDF. Please try again.",
                "error"
            );
        } finally {
            setIsDownloading(false);
        }
    };

    const handleBackToBuilder = () => {
        setGeneratedHtml(""); // Clear the preview so the form shows again
        router.push("/tools/resume/builder");
    };

    if (!generatedHtml) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-24">
                <p className="text-gray-400">No resume generated yet.</p>
                <button
                    onClick={() => router.push("/tools/resume/builder")}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Go to Builder
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col items-center gap-8"
        >
            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={handleBackToBuilder}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Builder
                </button>
                <button
                    onClick={() => {
                        setGeneratedHtml("");
                        router.push("/tools/resume/templates");
                    }}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LayoutTemplate className="h-4 w-4" />
                    Change Template
                </button>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(3,105,161,0.4)] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download className="h-4 w-4" />
                            Download PDF
                        </>
                    )}
                </button>
            </div>

            {/* Resume document wrapper with responsive scaling */}
            <div className="w-full flex justify-center pb-8 overflow-hidden rounded-xl bg-gray-50/50 sm:bg-transparent">
                <div className="rounded-sm border border-gray-200/60 bg-white shadow-2xl shrink-0 print:border-none print:shadow-none print:transform-none origin-top transition-all duration-500 transform scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 hover:shadow-[0_24px_60px_rgba(17,24,39,0.16)]">
                    <div
                        id="resume-preview"
                        ref={resumeRef}
                        className="prose prose-sm max-w-none resume-preview-container"
                        style={{ width: "210mm", minHeight: "297mm", overflowWrap: "break-word", wordWrap: "break-word", overflow: "hidden" }}
                        dangerouslySetInnerHTML={{ __html: generatedHtml }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
