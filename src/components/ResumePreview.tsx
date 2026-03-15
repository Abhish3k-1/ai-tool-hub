"use client";

import { useResume } from "@/context/ResumeContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, ArrowLeft, LayoutTemplate, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

export default function ResumePreview() {
    const { generatedHtml, setGeneratedHtml } = useResume();
    const router = useRouter();
    const resumeRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!resumeRef.current || isDownloading) return;
        
        setIsDownloading(true);
        console.log("Starting PDF generation...");

        try {
            // Import libraries directly
            const html2canvas = (await import("html2canvas")).default;
            const { jsPDF } = await import("jspdf");

            // Ensure the page is scrolled to top for accurate capture
            window.scrollTo(0, 0);

            // Capture the element with a slightly lower scale to save memory
            const canvas = await html2canvas(resumeRef.current, {
                scale: 1.5, // Reduced from 2.0 to prevent memory crashes
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                // Defensive: Ensure no complex CSS causes issues during capture
                onclone: (clonedDoc) => {
                    const container = clonedDoc.querySelector('.resume-preview-container') as HTMLElement;
                    if (container) {
                        container.style.transform = 'none';
                        container.style.margin = '0';
                        container.style.width = '210mm'; // Force A4 width
                        
                        // Aggressively strip/replace modern colors that crash html2canvas
                        const allElements = container.querySelectorAll('*');
                        allElements.forEach(el => {
                            const htmlEl = el as HTMLElement;
                            if (htmlEl.style) {
                                const style = htmlEl.getAttribute('style') || '';
                                if (style.includes('oklch') || style.includes('oklab') || style.includes('lab(')) {
                                    // Replace with a safe fallback (black or inherited)
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

            // Convert canvas to image and add to PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save('resume.pdf');
            
            console.log("PDF generation success!");
        } catch (error: any) {
            console.error("PDF generation failed:", error);
            // More user-friendly error
            alert("Sorry, we couldn't generate your PDF. This can happen if the resume content is too large or contains complex styles. Please try again or use the browser Print option (Ctrl+P).");
        } finally {
            // Delay reset slightly to ensure UI is stable
            setTimeout(() => {
                setIsDownloading(false);
            }, 500);
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
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer"
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
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-8"
        >
            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={handleBackToBuilder}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LayoutTemplate className="h-4 w-4" />
                    Change Template
                </button>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="rounded-sm border border-gray-200/60 bg-white shadow-2xl shrink-0 print:border-none print:shadow-none print:transform-none origin-top transition-transform duration-300 transform scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100">
                    <div
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
