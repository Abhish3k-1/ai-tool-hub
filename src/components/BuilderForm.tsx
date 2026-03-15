"use client";

import React from "react";
import { useResume } from "@/context/ResumeContext";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { motion } from "framer-motion";
import {
    Briefcase,
    User,
    GraduationCap,
    Wrench,
    FolderOpen,
    Award,
    Plus,
    Trash2,
    Sparkles,
    Languages,
    Heart,
} from "lucide-react";

/* ---------- tiny helpers ---------- */

function SectionCard({
    icon: Icon,
    title,
    children,
    delay = 0,
}: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    delay?: number;
}) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            {children}
        </motion.section>
    );
}

function Input({
    label,
    ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {label}
            </label>
            <input
                {...props}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
        </div>
    );
}

function TextArea({
    label,
    ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {label}
            </label>
            <textarea
                {...props}
                rows={3}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
        </div>
    );
}

/* ---------- main component ---------- */

export default function BuilderForm() {
    const { resumeData, setResumeData, setGeneratedHtml, setIsGenerating } =
        useResume();
    const router = useRouter();
    const { showToast } = useToast();

    /* --- field updaters --- */
    const update = (field: string, value: string) =>
        setResumeData((d) => ({ ...d, [field]: value }));

    const updateArrayItem = (
        section: "experience" | "education" | "projects" | "certifications",
        index: number,
        field: string,
        value: string
    ) =>
        setResumeData((d) => ({
            ...d,
            [section]: d[section].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));

    const addItem = (section: "experience" | "education" | "projects" | "certifications") => {
        const templates: Record<string, object> = {
            experience: { title: "", company: "", location: "", startDate: "", endDate: "", description: "" },
            education: { degree: "", institution: "", location: "", graduationDate: "", gradeType: "cgpa", gradeValue: "" },
            projects: { name: "", description: "", technologies: "", link: "" },
            certifications: { name: "", issuer: "", date: "" },
        };
        setResumeData((d) => ({
            ...d,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [section]: [...(d as any)[section], templates[section]],
        }));
    };

    const removeItem = (section: "experience" | "education" | "projects" | "certifications", index: number) =>
        setResumeData((d) => ({
            ...d,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [section]: (d as any)[section].filter((_: unknown, i: number) => i !== index),
        }));

    /* --- simple array helpers --- */
    const updateStringArrayItem = (field: "skills" | "languages" | "softSkills", index: number, value: string) =>
        setResumeData((d) => ({
            ...d,
            [field]: d[field].map((s, i) => (i === index ? value : s)),
        }));

    const addStringArrayItem = (field: "skills" | "languages" | "softSkills") =>
        setResumeData((d) => ({ ...d, [field]: [...d[field], ""] }));

    const removeStringArrayItem = (field: "skills" | "languages" | "softSkills", index: number) =>
        setResumeData((d) => ({
            ...d,
            [field]: d[field].filter((_, i) => i !== index),
        }));

    /* --- helpers --- */
    const [generatingProjectDesc, setGeneratingProjectDesc] = React.useState<number | null>(null);

    const handleGenerateProjectDesc = async (index: number) => {
        const proj = resumeData.projects[index];
        if (!proj.name) {
            showToast("Please enter a project name first.", "warning");
            return;
        }

        setGeneratingProjectDesc(index);
        try {
            const res = await fetch("/api/generate-project-desc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectName: proj.name,
                    technologies: proj.technologies,
                    targetRole: resumeData.targetRole
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Generation failed");

            updateArrayItem("projects", index, "description", data.description);
        } catch (err) {
            console.error(err);
            showToast("Failed to generate description. Please try again.", "error");
        } finally {
            setGeneratingProjectDesc(null);
        }
    };

    const [generatingExpDesc, setGeneratingExpDesc] = React.useState<number | null>(null);

    const handleGenerateExpDesc = async (index: number) => {
        const exp = resumeData.experience[index];
        if (!exp.title || !exp.company) {
            showToast("Please enter a job title and company first.", "warning");
            return;
        }

        setGeneratingExpDesc(index);
        try {
            const res = await fetch("/api/generate-exp-desc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: exp.title,
                    company: exp.company,
                    targetRole: resumeData.targetRole
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Generation failed");

            updateArrayItem("experience", index, "description", data.description);
        } catch (err) {
            console.error(err);
            showToast("Failed to generate description. Please try again.", "error");
        } finally {
            setGeneratingExpDesc(null);
        }
    };

    /* --- submit --- */
    const { user } = useAuth();

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch("/api/tools/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resumeData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Generation failed");

            // Harden HTML against modern color functions that crash the PDF generator
            const sanitizeHtml = (htmlStr: string) => {
                return htmlStr
                    .replace(/oklch\([^)]*\)/g, '#111827')
                    .replace(/oklab\([^)]*\)/g, '#111827')
                    .replace(/lab\([^)]*\)/g, '#111827');
            };

            const html = sanitizeHtml(data.html);
            setGeneratedHtml(html);

            // Save to Supabase
            try {
                const supabase = createClient();
                const { error: saveError } = await supabase
                    .from("resumes")
                    .insert([
                        {
                            target_role: resumeData.targetRole,
                            generated_html: html,
                            user_id: user?.uid || null,
                            // resume_data: resumeData, // Commenting out to avoid potential schema mismatch if this field wasn't in original project
                        },
                    ]);

                if (saveError) {
                    console.error("Supabase Save Error Details:", saveError.message, saveError.details, saveError.hint);
                    showToast(`Saved to history locally, but failed to sync to database: ${saveError.message}`, "warning");
                } else {
                    console.log("Resume saved to Supabase successfully");
                }
            } catch (dbErr: any) {
                console.error("Database connection error:", dbErr.message);
            }

        } catch (err) {
            console.error(err);
            showToast("Resume generation failed. Please try again.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    /* ======================== RENDER ======================== */

    return (
        <div className="flex flex-col gap-6">
            {/* Target Role */}
            <SectionCard icon={Briefcase} title="Target Job Role" delay={0}>
                <Input
                    label="Job Title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={resumeData.targetRole}
                    onChange={(e) => update("targetRole", e.target.value)}
                />
            </SectionCard>

            {/* Personal Info */}
            <SectionCard icon={User} title="Personal Information" delay={0.05}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Full Name" placeholder="John Doe" value={resumeData.fullName} onChange={(e) => update("fullName", e.target.value)} />
                    <Input label="Email" placeholder="john@email.com" value={resumeData.email} onChange={(e) => update("email", e.target.value)} />
                    <Input label="Phone" placeholder="+1 234 567 890" value={resumeData.phone} onChange={(e) => update("phone", e.target.value)} />
                    <Input label="Location" placeholder="San Francisco, CA" value={resumeData.location} onChange={(e) => update("location", e.target.value)} />
                    <Input label="LinkedIn" placeholder="linkedin.com/in/johndoe" value={resumeData.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
                </div>
            </SectionCard>

            {/* Experience */}
            <SectionCard icon={Briefcase} title="Experience (Optional)" delay={0.1}>
                {resumeData.experience.map((exp, i) => (
                    <div key={i} className="mb-4 rounded-xl border border-gray-200 bg-white p-4 relative shadow-sm">
                        {resumeData.experience.length > 1 && (
                            <button onClick={() => removeItem("experience", i)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Job Title" placeholder="Software Engineer" value={exp.title} onChange={(e) => updateArrayItem("experience", i, "title", e.target.value)} />
                            <Input label="Company" placeholder="Google" value={exp.company} onChange={(e) => updateArrayItem("experience", i, "company", e.target.value)} />
                            <Input label="Location" placeholder="Mountain View, CA" value={exp.location} onChange={(e) => updateArrayItem("experience", i, "location", e.target.value)} />
                            <Input label="Start Date" placeholder="Jan 2022" value={exp.startDate} onChange={(e) => updateArrayItem("experience", i, "startDate", e.target.value)} />
                            <Input label="End Date" placeholder="Present" value={exp.endDate} onChange={(e) => updateArrayItem("experience", i, "endDate", e.target.value)} />
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <div className="flex items-end justify-between">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Description
                                </label>
                                <button
                                    onClick={() => handleGenerateExpDesc(i)}
                                    disabled={generatingExpDesc === i}
                                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    {generatingExpDesc === i ? "Generating..." : "✨ AI Generate"}
                                </button>
                            </div>
                            <textarea
                                value={exp.description}
                                onChange={(e) => updateArrayItem("experience", i, "description", e.target.value)}
                                rows={4}
                                placeholder="Key achievements and responsibilities... (Write manually or use AI Generate)"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            />
                        </div>
                    </div>
                ))}
                <button onClick={() => addItem("experience")} className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" /> Add Experience
                </button>
            </SectionCard>

            {/* Education */}
            <SectionCard icon={GraduationCap} title="Education" delay={0.15}>
                {resumeData.education.map((edu, i) => (
                    <div key={i} className="mb-4 rounded-xl border border-gray-200 bg-white p-4 relative shadow-sm">
                        {resumeData.education.length > 1 && (
                            <button onClick={() => removeItem("education", i)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Degree / 10th / 12th" placeholder="B.S. / 12th / 10th" value={edu.degree} onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)} />
                            <Input label="Institution" placeholder="MIT / High School" value={edu.institution} onChange={(e) => updateArrayItem("education", i, "institution", e.target.value)} />
                            <Input label="Location" placeholder="Cambridge, MA" value={edu.location} onChange={(e) => updateArrayItem("education", i, "location", e.target.value)} />
                            <Input label="Graduation Year" placeholder="2023" value={edu.graduationDate} onChange={(e) => updateArrayItem("education", i, "graduationDate", e.target.value)} />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Grade
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-1/3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none"
                                        value={edu.gradeType || "cgpa"}
                                        onChange={(e) => updateArrayItem("education", i, "gradeType", e.target.value)}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        style={{ WebkitAppearance: "none", MozAppearance: "none" } as any}
                                    >
                                        <option value="cgpa" className="bg-white text-gray-900">CGPA</option>
                                        <option value="percentage" className="bg-white text-gray-900">%</option>
                                    </select>
                                    <input
                                        placeholder={edu.gradeType === "percentage" ? "e.g. 85" : "e.g. 8.5"}
                                        value={edu.gradeValue || ""}
                                        onChange={(e) => updateArrayItem("education", i, "gradeValue", e.target.value)}
                                        className="w-2/3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={() => addItem("education")} className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" /> Add Education
                </button>
            </SectionCard>

            {/* Skills */}
            <SectionCard icon={Wrench} title="Technical Skills" delay={0.2}>
                <div className="flex flex-wrap gap-3">
                    {resumeData.skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                value={skill}
                                placeholder="e.g. React"
                                onChange={(e) => updateStringArrayItem("skills", i, e.target.value)}
                                className="w-36 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            {resumeData.skills.length > 1 && (
                                <button onClick={() => removeStringArrayItem("skills", i)} className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={() => addStringArrayItem("skills")} className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" /> Add Skill
                </button>
            </SectionCard>

            {/* Languages Known */}
            <SectionCard icon={Languages} title="Languages Known" delay={0.22}>
                <div className="flex flex-wrap gap-3">
                    {resumeData.languages.map((lang, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                value={lang}
                                placeholder="e.g. English"
                                onChange={(e) => updateStringArrayItem("languages", i, e.target.value)}
                                className="w-36 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            {resumeData.languages.length > 1 && (
                                <button onClick={() => removeStringArrayItem("languages", i)} className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={() => addStringArrayItem("languages")} className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" /> Add Language
                </button>
            </SectionCard>

            {/* Soft Skills */}
            <SectionCard icon={Heart} title="Soft Skills (Optional)" delay={0.24}>
                <div className="flex flex-wrap gap-3">
                    {resumeData.softSkills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                value={skill}
                                placeholder="e.g. Leadership"
                                onChange={(e) => updateStringArrayItem("softSkills", i, e.target.value)}
                                className="w-36 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            {resumeData.softSkills.length > 1 && (
                                <button onClick={() => removeStringArrayItem("softSkills", i)} className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={() => addStringArrayItem("softSkills")} className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" /> Add Soft Skill
                </button>
            </SectionCard>

            {/* Projects */}
            <SectionCard icon={FolderOpen} title="Projects (Optional)" delay={0.25}>
                {resumeData.projects.map((proj, i) => (
                    <div key={i} className="mb-4 rounded-xl border border-gray-200 bg-white p-4 relative shadow-sm">
                        {resumeData.projects.length > 1 && (
                            <button onClick={() => removeItem("projects", i)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Project Name" placeholder="My Awesome App" value={proj.name} onChange={(e) => updateArrayItem("projects", i, "name", e.target.value)} />
                            <Input label="Technologies" placeholder="React, Node.js" value={proj.technologies} onChange={(e) => updateArrayItem("projects", i, "technologies", e.target.value)} />
                            <Input label="Link" placeholder="https://github.com/..." value={proj.link} onChange={(e) => updateArrayItem("projects", i, "link", e.target.value)} />
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <div className="flex items-end justify-between">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Description
                                </label>
                                <button
                                    onClick={() => handleGenerateProjectDesc(i)}
                                    disabled={generatingProjectDesc === i}
                                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    {generatingProjectDesc === i ? "Generating..." : "✨ AI Generate"}
                                </button>
                            </div>
                            <textarea
                                value={proj.description}
                                onChange={(e) => updateArrayItem("projects", i, "description", e.target.value)}
                                rows={3}
                                placeholder="What does this project do? (Write manually or use AI Generate)"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            />
                        </div>
                    </div>
                ))}
                <button onClick={() => addItem("projects")} className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" /> Add Project
                </button>
            </SectionCard>

            {/* Certifications */}
            <SectionCard icon={Award} title="Certifications (Optional)" delay={0.3}>
                {resumeData.certifications.map((cert, i) => (
                    <div key={i} className="mb-4 rounded-xl border border-gray-200 bg-white p-4 relative shadow-sm">
                        {resumeData.certifications.length > 1 && (
                            <button onClick={() => removeItem("certifications", i)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Certification Name" placeholder="AWS Solutions Architect" value={cert.name} onChange={(e) => updateArrayItem("certifications", i, "name", e.target.value)} />
                            <Input label="Issuer" placeholder="Amazon" value={cert.issuer} onChange={(e) => updateArrayItem("certifications", i, "issuer", e.target.value)} />
                            <Input label="Date" placeholder="Dec 2023" value={cert.date} onChange={(e) => updateArrayItem("certifications", i, "date", e.target.value)} />
                        </div>
                    </div>
                ))}
                <button onClick={() => addItem("certifications")} className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" /> Add Certification
                </button>
            </SectionCard>

            {/* Generate Button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer"
            >
                <Sparkles className="h-5 w-5" />
                Generate Resume
            </motion.button>
        </div>
    );
}
