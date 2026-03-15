"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ResumeData {
    templateId: string;
    targetRole: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    experience: {
        title: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
    education: {
        degree: string;
        institution: string;
        location: string;
        graduationDate: string;
        gradeType: "cgpa" | "percentage";
        gradeValue: string;
    }[];
    skills: string[];
    softSkills: string[];
    languages: string[];
    projects: {
        name: string;
        description: string;
        technologies: string;
        link: string;
    }[];
    certifications: {
        name: string;
        issuer: string;
        date: string;
    }[];
}

interface ResumeContextType {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    generatedHtml: string;
    setGeneratedHtml: React.Dispatch<React.SetStateAction<string>>;
    isGenerating: boolean;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTemplateId: string;
    setSelectedTemplateId: React.Dispatch<React.SetStateAction<string>>;
}

const defaultResumeData: ResumeData = {
    templateId: "",
    targetRole: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    experience: [
        {
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
        },
    ],
    education: [
        {
            degree: "",
            institution: "",
            location: "",
            graduationDate: "",
            gradeType: "cgpa",
            gradeValue: "",
        },
    ],
    skills: [""],
    softSkills: [""],
    languages: [""],
    projects: [{ name: "", description: "", technologies: "", link: "" }],
    certifications: [{ name: "", issuer: "", date: "" }],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
    const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
    const [generatedHtml, setGeneratedHtml] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState("");

    return (
        <ResumeContext.Provider
            value={{
                resumeData,
                setResumeData,
                generatedHtml,
                setGeneratedHtml,
                isGenerating,
                setIsGenerating,
                selectedTemplateId,
                setSelectedTemplateId,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error("useResume must be used within a ResumeProvider");
    }
    return context;
}
