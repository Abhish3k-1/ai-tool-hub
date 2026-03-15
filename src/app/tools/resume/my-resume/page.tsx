"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Download,
    LayoutTemplate,
    FileText,
    Loader2,
} from "lucide-react";
import DeleteResumeButton from "@/components/DeleteResumeButton";
import { useToast } from "@/components/Toast";
import { generateResumePdf } from "@/lib/resume-pdf";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/utils/supabase/client";

interface SavedResume {
    id: string;
    target_role: string;
    generated_html: string;
    created_at: string;
}

export default function MyResumePage() {
    const [resume, setResume] = useState<SavedResume | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const resumeRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        async function fetchResume() {
            if (!user?.uid) {
                setResume(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const supabase = createClient();
                const { data, error: fetchError } = await supabase
                    .from("resume")
                    .select("*")
                    .eq("user_id", user.uid)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (fetchError) {
                    console.error("Supabase error:", fetchError);
                    setError("Failed to load your resume.");
                } else if (data) {
                    // Standardize sanitization here too, in case DB has old unsanitized entries
                    const sanitizedHtml = data.generated_html
                        .replace(/oklch\([^)]*\)/g, '#111111')
                        .replace(/oklab\([^)]*\)/g, '#111111')
                        .replace(/lab\([^)]*\)/g, '#111111');
                    
                    setResume({
                        ...data,
                        generated_html: sanitizedHtml
                    });
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load your resume. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchResume();
    }, [user?.uid]);

    const handleDownload = async () => {
        if (isDownloading) return;

        // Ensure the HTML content exists before generating the PDF.
        if (!resume?.generated_html || !resume.generated_html.trim()) {
            showToast("No resume content to download.", "error");
            return;
        }

        const previewElement = resumeRef.current;
        if (!previewElement) {
            showToast("Resume preview is not ready yet. Please try again.", "error");
            return;
        }

        setIsDownloading(true);
        try {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            await generateResumePdf({ element: previewElement, fileName: "resume.pdf" });
            showToast("Resume PDF downloaded successfully.", "success");
        } catch (error: unknown) {
            console.error("PDF generation failed:", error);
            const message = error instanceof Error ? error.message : "Sorry, we couldn't generate your PDF. Please try again.";
            showToast(
                message,
                "error"
            );
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
        >
            <div className="glass-panel mb-8 rounded-3xl p-5 sm:p-7">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-sky-100 p-3 text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Resume</h1>
                        <p className="text-gray-500">
                            Your most recently generated resume, ready to download anytime.
                        </p>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
                    <p className="text-gray-500">Loading your resume...</p>
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="text-center py-24">
                    <p className="text-red-600 bg-red-50 rounded-xl px-6 py-4 inline-block border border-red-200">
                        {error}
                    </p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && !resume && (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50">
                        <FileText className="h-10 w-10 text-sky-500" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            No resume yet
                        </h2>
                        <p className="mt-2 text-gray-500 max-w-sm">
                            You haven&apos;t generated a resume yet. Pick a template and
                            build one!
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/tools/resume/templates")}
                        className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-[0_14px_30px_rgba(3,105,161,0.35)] cursor-pointer"
                    >
                        <LayoutTemplate className="h-4 w-4" />
                        Choose a Template
                    </button>
                </div>
            )}

            {/* Resume found */}
            {!loading && !error && resume && (
                <div className="flex flex-col items-center gap-8">
                    {/* Meta info + Actions */}
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                        <div>
                            <p className="text-sm text-gray-500">Target Role</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {resume.target_role || "General"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Generated{" "}
                                {new Date(resume.created_at).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => router.push("/tools/resume/templates")}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LayoutTemplate className="h-4 w-4" />
                                New Resume
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-[0_14px_30px_rgba(3,105,161,0.35)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" />
                                        Download PDF
                                    </>
                                )}
                            </button>
                            <DeleteResumeButton resumeId={resume.id} onDelete={() => setResume(null)} />
                        </div>
                    </div>

                    {/* Resume document */}
                    <div className="w-full flex justify-center pb-8 overflow-hidden rounded-xl bg-gray-50">
                        <div className="rounded-sm border border-gray-200 bg-white shadow-2xl shrink-0 print:border-none print:shadow-none print:transform-none origin-top transition-all duration-500 transform scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 hover:shadow-[0_24px_60px_rgba(17,24,39,0.16)]">
                            <div
                                id="resume-preview"
                                ref={resumeRef}
                                className="prose prose-sm max-w-none text-black resume-preview-container"
                                style={{ width: "210mm", minHeight: "297mm", overflowWrap: "break-word", wordWrap: "break-word", overflow: "hidden" }}
                                dangerouslySetInnerHTML={{
                                    __html: resume.generated_html,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
