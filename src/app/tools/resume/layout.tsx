import type { Metadata } from "next";
import { ResumeProvider } from "@/context/ResumeContext";

export const metadata: Metadata = {
  title: "AI Resume Maker — AI Tools Hub",
  description:
    "Generate ATS-optimized professional resumes instantly using AI. Modern, clean, and ready to download as PDF.",
};

export default function ResumeToolLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ResumeProvider>{children}</ResumeProvider>
  );
}
