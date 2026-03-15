"use client";

import { useResume } from "@/context/ResumeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutTemplate, ChevronRight, Search, FileText } from "lucide-react";
import templates, { ResumeTemplate } from "@/lib/templates";
import { useState, useMemo } from "react";

const categories = ["All", "Modern", "Classic", "Creative", "Corporate", "Tech"];

function TemplateCard({
    template,
    index,
    onSelect,
}: {
    template: ResumeTemplate;
    index: number;
    onSelect: (id: string) => void;
}) {
    return (
        <div
            onClick={() => onSelect(template.id)}
            className="group cursor-pointer rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200 overflow-hidden"
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
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
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {template.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Title section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                        <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Choose Your Template
                        </h1>
                        <p className="text-gray-500">
                            Pick a design that matches your style. Each template is ATS-optimized and professionally crafted.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                {/* Category pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                activeCategory === cat
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search templates..."
                        className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTemplates.map((template, i) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        index={i}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <LayoutTemplate className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium">No templates found</p>
                    <p className="text-sm mt-1">Try a different search or category</p>
                </div>
            )}
        </div>
    );
}
