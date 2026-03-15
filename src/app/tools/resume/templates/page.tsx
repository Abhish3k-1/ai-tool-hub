"use client";

import { useResume } from "@/context/ResumeContext";
import { useRouter } from "next/navigation";
import { LayoutTemplate, ChevronRight, Search } from "lucide-react";
import templates, { ResumeTemplate } from "@/lib/templates";
import { useState, useMemo } from "react";

const categories = ["All", "Modern", "Classic", "Creative", "Corporate", "Tech"];

function TemplateCard({
    template,
    onSelect,
}: {
    template: ResumeTemplate;
    onSelect: (id: string) => void;
}) {
    return (
        <div
            onClick={() => onSelect(template.id)}
            className="group hover-lift glass-card cursor-pointer overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm"
        >
            {/* Preview Stripe */}
            <div
                className="h-36 relative overflow-hidden flex items-end p-4"
                style={{ background: template.previewBg }}
            >
                {/* Mini resume lines */}
                <div className="absolute inset-3 flex flex-col gap-1.5 opacity-60">
                    <div className="h-3 w-3/5 rounded" style={{ background: template.color }} />
                    <div className="h-1.5 w-4/5 rounded bg-gray-300" />
                    <div className="h-1.5 w-3/5 rounded bg-gray-300" />
                    <div className="mt-2 h-1 w-2/5 rounded" style={{ background: template.color, opacity: 0.6 }} />
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-4/5 rounded bg-gray-200" />
                    <div className="mt-2 h-1 w-2/5 rounded" style={{ background: template.color, opacity: 0.6 }} />
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-3/5 rounded bg-gray-200" />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/35">
                    <span className="hidden group-hover:flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-sm font-semibold text-gray-900 shadow-lg">
                        Use Template
                        <ChevronRight className="h-4 w-4" />
                    </span>
                </div>

                {/* Category badge */}
                <span
                    className="relative z-10 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/90 shadow-sm"
                    style={{ color: template.color }}
                >
                    {template.category}
                </span>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-sky-700">
                    {template.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {template.description}
                </p>

                {/* Accent bar */}
                <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 w-8 rounded-full" style={{ background: template.color }} />
                    <div className="h-1.5 w-4 rounded-full opacity-50" style={{ background: template.color }} />
                    <div className="h-1.5 w-2 rounded-full opacity-25" style={{ background: template.color }} />
                </div>
            </div>
        </div>
    );
}

export default function TemplatesPage() {
    const { setResumeData, setSelectedTemplateId, setGeneratedHtml } = useResume();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");

    const filteredTemplates = useMemo(() => {
        return templates.filter((t) => {
            const matchesCategory = activeCategory === "All" || t.category === activeCategory;
            const matchesSearch =
                !search ||
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.description.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, search]);

    const handleSelect = (id: string) => {
        setGeneratedHtml(""); // Clear previous results so builder form shows
        setSelectedTemplateId(id);
        setResumeData((prev) => ({ ...prev, templateId: id }));
        router.push("/tools/resume/builder");
    };

    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
            {/* Title section */}
            <div className="glass-panel mb-8 rounded-3xl p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 shadow-sm">
                        <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            Choose Your Template
                        </h1>
                        <p className="text-slate-600">
                            Pick a design that matches your style. Each template is ATS-optimized and professionally crafted.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="glass-card mb-8 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Category pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                                activeCategory === cat
                                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-[0_8px_20px_rgba(3,105,161,0.35)]"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search templates..."
                        className="w-full rounded-xl border border-slate-300 bg-white/95 py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTemplates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                    <LayoutTemplate className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium text-slate-700">No templates found</p>
                    <p className="text-sm mt-1">Try a different search or category</p>
                </div>
            )}
        </div>
    );
}
