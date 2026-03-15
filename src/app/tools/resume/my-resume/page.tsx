"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Download,
    LayoutTemplate,
    FileText,
    Loader2,
} from "lucide-react";
import DeleteResumeButton from "@/components/DeleteResumeButton";
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
    const router = useRouter();

    useEffect(() => {
        async function fetchResume() {
            try {
                const supabase = createClient();
                const { data, error: fetchError } = await supabase
                    .from("resumes")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (fetchError) {
                    console.error("Supabase error:", fetchError);
                    setError("Failed to load your resume.");
                } else if (data) {
                    // Standardize sanitization here too, in case DB has old unsanitized entries
                    const sanitizedHtml = data.generated_html
                        .replace(/oklch\([^)]*\)/g, '#111827')
                        .replace(/oklab\([^)]*\)/g, '#111827')
                        .replace(/lab\([^)]*\)/g, '#111827');
                    
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
    }, [router]);

    const handleDownload = async () => {
        if (!resumeRef.current || isDownloading) return;
        
        setIsDownloading(true);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const { jsPDF } = await import("jspdf");

            window.scrollTo(0, 0);

            const canvas = await html2canvas(resumeRef.current, {
                scale: 1.5,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                onclone: (clonedDoc) => {
                    const container = clonedDoc.querySelector('.resume-preview-container') as HTMLElement;
                    if (container) {
                        container.style.transform = 'none';
                        container.style.margin = '0';
                        container.style.width = '210mm';
                        
                        const allElements = container.querySelectorAll('*');
                        allElements.forEach(el => {
                            const htmlEl = el as HTMLElement;
                            if (htmlEl.style) {
                                const style = htmlEl.getAttribute('style') || '';
                                if (style.includes('oklch') || style.includes('oklab') || style.includes('lab(')) {
                                    const sanitized = style
                                        .replace(/oklch\([^)]*\)/g, '#111827')
                                        .replace(/oklab\([^)]*\)/g, '#111827')
                                        .replace(/lab\([^)]*\)/g, '#111827');
                                    htmlEl.setAttribute('style', sanitized);
                                }
                            }
                        });
                    }
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save('resume.pdf');
        } catch (error: any) {
            console.error("PDF generation failed:", error);
            alert("Sorry, we couldn't generate your PDF. This can happen if the resume content is too large or contains complex styles. Please try again or use the browser Print option (Ctrl+P).");
        } finally {
            setTimeout(() => {
                setIsDownloading(false);
            }, 500);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
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
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
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
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                        <FileText className="h-10 w-10 text-indigo-500" />
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
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all cursor-pointer"
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
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
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
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LayoutTemplate className="h-4 w-4" />
                                New Resume
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="rounded-sm border border-gray-200 bg-white shadow-2xl shrink-0 print:border-none print:shadow-none print:transform-none origin-top transition-transform duration-300 transform scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100">
                            <div
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
        </div>
    );
}
