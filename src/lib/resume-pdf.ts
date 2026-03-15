"use client";

interface GenerateResumePdfOptions {
    element: HTMLElement;
    fileName?: string;
}

const UNSAFE_COLOR_FN_REGEX = /(oklch|oklab|lab)\([^)]*\)/gi;
const GRADIENT_REGEX = /(linear-gradient|radial-gradient|conic-gradient)\([^)]*\)/gi;
const UNSAFE_DECLARATION_REGEX =
    /(^|;)\s*(filter|backdrop-filter|-webkit-backdrop-filter|box-shadow|text-shadow)\s*:[^;]*/gi;
const PAGE_OVERFLOW_EPSILON_MM = 0.8;

function sanitizeInlineStyle(styleText: string): string {
    return styleText
        .replace(UNSAFE_COLOR_FN_REGEX, "#111111")
        .replace(GRADIENT_REGEX, "#ffffff")
        .replace(UNSAFE_DECLARATION_REGEX, "$1")
        .replace(/(^|;)\s*background-image\s*:[^;]*/gi, "$1");
}

function sanitizeCloneTree(root: HTMLElement) {
    const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];

    nodes.forEach((node) => {
        const inlineStyle = node.getAttribute("style");
        if (inlineStyle) {
            node.setAttribute("style", sanitizeInlineStyle(inlineStyle));
        }

        node.style.filter = "none";
        node.style.backdropFilter = "none";
        node.style.setProperty("-webkit-backdrop-filter", "none");
        node.style.boxShadow = "none";
        node.style.textShadow = "none";
        node.style.backgroundImage = "none";
    });

    root.style.width = "210mm";
    root.style.minHeight = "297mm";
    root.style.margin = "0";
    root.style.transform = "none";
    root.style.overflow = "hidden";
}

async function waitForFonts() {
    if (typeof document === "undefined" || !("fonts" in document)) return;
    try {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    } catch {
        // Continue PDF rendering even if font readiness cannot be resolved.
    }
}

export async function generateResumePdf({
    element,
    fileName = "resume.pdf",
}: GenerateResumePdfOptions) {
    if (!element) {
        throw new Error("Resume container is missing.");
    }

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    await waitForFonts();

    const sandbox = document.createElement("div");
    sandbox.setAttribute("aria-hidden", "true");
    sandbox.style.position = "fixed";
    sandbox.style.left = "-10000px";
    sandbox.style.top = "0";
    sandbox.style.pointerEvents = "none";
    sandbox.style.opacity = "0";
    sandbox.style.zIndex = "-1";

    const clone = element.cloneNode(true) as HTMLElement;
    clone.id = "resume-preview-pdf-clone";
    sanitizeCloneTree(clone);

    sandbox.appendChild(clone);
    document.body.appendChild(sandbox);

    try {
        const canvas = await html2canvas(clone, {
            scale: 2, // As requested
            useCORS: true, // As requested
            backgroundColor: "#ffffff", // As requested
            logging: false,
            removeContainer: true,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pdfWidth = 210;
        const pdfHeight = 297;
        const imageHeight = (canvas.height * pdfWidth) / canvas.width;

        let remainingHeight = imageHeight - pdfHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imageHeight);

        // Ignore tiny fractional overflow; it otherwise creates a blank extra page.
        while (remainingHeight > PAGE_OVERFLOW_EPSILON_MM) {
            position = remainingHeight - imageHeight;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imageHeight);
            remainingHeight -= pdfHeight;
        }

        pdf.save(fileName);
    } catch (err: unknown) {
        console.error("html2canvas/jspdf error:", err);
        throw new Error("Failed to capture resume content. Please try again.");
    } finally {
        sandbox.remove();
    }
}
