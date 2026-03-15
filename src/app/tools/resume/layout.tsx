import type { Metadata } from "next";
import { ResumeProvider } from "@/context/ResumeContext";
import ProtectedRoute from "@/components/ProtectedRoute";

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
    <ProtectedRoute>
      <ResumeProvider>{children}</ResumeProvider>
    </ProtectedRoute>
  );
}
