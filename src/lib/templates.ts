export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    color: string;          // Accent color for preview card
    previewBg: string;      // Light BG for preview card
    promptStyle: string;    // Injected into AI prompt
}

const templates: ResumeTemplate[] = [
    /* ─── 1. MODERN MINIMALIST ─── */
    {
        id: "modern-minimalist",
        name: "Modern Minimalist",
        description: "Clean lines, generous whitespace, and a refined sans-serif look.",
        category: "Modern",
        color: "#4F46E5",
        previewBg: "#EEF2FF",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:20mm;box-sizing:border-box;font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:#1F2937;line-height:1.65;"

HEADER:
- Name: style="font-size:30px;font-weight:800;text-align:center;margin:0 0 6px 0;letter-spacing:1px;color:#111827;"
- Contact line: style="font-size:12px;color:#6B7280;text-align:center;margin:0 0 14px 0;" use " · " as separator.
- Divider: style="border:none;border-top:2px solid #E5E7EB;margin:0 0 20px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #E5E7EB;padding-bottom:4px;margin:22px 0 12px 0;color:#4F46E5;"

EXPERIENCE ENTRIES:
- Job Title: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Company line: style="font-size:12px;color:#6B7280;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#374151;"

EDUCATION:
- Degree: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Institution line: style="font-size:12px;color:#6B7280;margin:0 0 4px 0;"

SKILLS:
- Each line: style="font-size:13px;margin:0 0 5px 0;color:#374151;" Category bold.

PROJECTS:
- Project Name: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Tech: style="font-size:12px;font-style:italic;color:#6B7280;margin:0 0 4px 0;"
- Bullets: same as experience.

CERTIFICATIONS:
- Each: style="font-size:13px;margin:0 0 5px 0;color:#374151;"

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;text-align:justify;"
`,
    },

    /* ─── 2. EXECUTIVE CLASSIC ─── */
    {
        id: "executive-classic",
        name: "Executive Classic",
        description: "Timeless serif typography with bold headers – executive-level presence.",
        category: "Classic",
        color: "#1E3A5F",
        previewBg: "#F0F4F8",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:22mm 20mm;box-sizing:border-box;font-family:'Georgia','Times New Roman',serif;color:#1a1a1a;line-height:1.7;"

HEADER:
- Name: style="font-size:32px;font-weight:700;text-align:center;margin:0 0 8px 0;letter-spacing:3px;text-transform:uppercase;color:#1E3A5F;"
- Contact: style="font-size:12px;color:#4A5568;text-align:center;margin:0 0 16px 0;" separator " | ".
- Divider: style="border:none;border-top:3px double #1E3A5F;margin:0 0 22px 0;"

SECTION TITLES:
style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #1E3A5F;padding-bottom:4px;margin:24px 0 12px 0;color:#1E3A5F;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:700;margin:0;color:#1a1a1a;"
- Company: style="font-size:12px;font-style:italic;color:#4A5568;margin:0 0 8px 0;"
- Bullets: ul style="padding-left:20px;margin:6px 0 16px 0;list-style-type:square;" li style="font-size:13px;margin-bottom:5px;color:#2D3748;text-align:justify;"

EDUCATION:
- Degree: style="font-size:14px;font-weight:700;margin:0;color:#1a1a1a;"
- Institution: style="font-size:12px;font-style:italic;color:#4A5568;margin:0 0 4px 0;"

SKILLS:
style="font-size:13px;margin:0 0 6px 0;color:#2D3748;" Category in bold.

PROJECTS:
- Name: style="font-size:14px;font-weight:700;margin:0;color:#1a1a1a;"
- Tech: style="font-size:12px;font-style:italic;color:#4A5568;margin:0 0 6px 0;"

CERTIFICATIONS:
style="font-size:13px;margin:0 0 6px 0;color:#2D3748;"

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#2D3748;text-align:justify;"
`,
    },

    /* ─── 3. TECH BOLD ─── */
    {
        id: "tech-bold",
        name: "Tech Bold",
        description: "Vibrant teal accents, mono-spaced section titles for a bold tech vibe.",
        category: "Tech",
        color: "#0D9488",
        previewBg: "#F0FDFA",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:18mm;box-sizing:border-box;font-family:'Roboto','Helvetica Neue',Arial,sans-serif;color:#1F2937;line-height:1.6;"

HEADER:
- Name: style="font-size:34px;font-weight:900;text-align:left;margin:0 0 4px 0;color:#0D9488;"
- Contact: style="font-size:12px;color:#6B7280;text-align:left;margin:0 0 14px 0;" separator " | ".
- Divider: style="border:none;border-top:4px solid #0D9488;margin:0 0 20px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:3px;padding:6px 12px;margin:22px 0 12px 0;color:white;background:#0D9488;display:inline-block;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:700;margin:0;color:#111827;"
- Company: style="font-size:12px;color:#6B7280;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#374151;"

EDUCATION:
- Degree: style="font-size:14px;font-weight:700;margin:0;color:#111827;"
- Institution: style="font-size:12px;color:#6B7280;margin:0 0 4px 0;"

SKILLS:
style="font-size:13px;margin:0 0 5px 0;color:#374151;"

PROJECTS:
- Name: style="font-size:14px;font-weight:700;margin:0;color:#111827;"
- Tech: style="font-size:12px;color:#6B7280;margin:0 0 4px 0;"

CERTIFICATIONS:
style="font-size:13px;margin:0 0 5px 0;color:#374151;"

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;border-left:4px solid #0D9488;padding-left:12px;"
`,
    },

    /* ─── 4. ELEGANT SERIF ─── */
    {
        id: "elegant-serif",
        name: "Elegant Serif",
        description: "Graceful serif font with soft rose accents – perfect for creative fields.",
        category: "Creative",
        color: "#BE185D",
        previewBg: "#FDF2F8",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:22mm 24mm;box-sizing:border-box;font-family:'Playfair Display','Georgia',serif;color:#1F2937;line-height:1.7;"

HEADER:
- Name: style="font-size:30px;font-weight:700;text-align:center;margin:0 0 6px 0;letter-spacing:2px;color:#BE185D;"
- Contact: style="font-size:11px;color:#6B7280;text-align:center;margin:0 0 14px 0;letter-spacing:1px;" separator " ✦ ".
- Divider: style="border:none;border-top:1px solid #FBCFE8;margin:0 0 20px 0;"

SECTION TITLES:
style="font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #FBCFE8;padding-bottom:4px;margin:22px 0 12px 0;color:#BE185D;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Company: style="font-size:12px;font-style:italic;color:#9CA3AF;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#374151;font-family:'Georgia',serif;"

EDUCATION:
- Degree: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Institution: style="font-size:12px;font-style:italic;color:#9CA3AF;margin:0 0 4px 0;"

SKILLS:
style="font-size:13px;margin:0 0 5px 0;color:#374151;"

PROJECTS:
- Name: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Tech: style="font-size:12px;font-style:italic;color:#9CA3AF;margin:0 0 4px 0;"

CERTIFICATIONS:
style="font-size:13px;margin:0 0 5px 0;color:#374151;"

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;text-align:justify;font-style:italic;"
`,
    },

    /* ─── 5. CORPORATE BLUE ─── */
    {
        id: "corporate-blue",
        name: "Corporate Blue",
        description: "Navy header band with white text – a polished corporate look.",
        category: "Corporate",
        color: "#1E40AF",
        previewBg: "#EFF6FF",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:0;box-sizing:border-box;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1F2937;line-height:1.6;"

HEADER: Wrap in a div with style="background:#1E40AF;padding:20mm 20mm 16mm 20mm;margin-bottom:20px;"
- Name: style="font-size:30px;font-weight:800;text-align:left;margin:0 0 6px 0;color:white;letter-spacing:1px;"
- Contact: style="font-size:12px;color:#BFDBFE;text-align:left;margin:0;" separator " | ".
- No divider needed (the colored block acts as one).

After header, add padding wrapper: style="padding:0 20mm 20mm 20mm;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #1E40AF;padding-bottom:4px;margin:22px 0 12px 0;color:#1E40AF;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Company: style="font-size:12px;color:#6B7280;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#374151;"

EDUCATION:
- Degree: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Institution: style="font-size:12px;color:#6B7280;margin:0 0 4px 0;"

SKILLS:
style="font-size:13px;margin:0 0 5px 0;color:#374151;"

PROJECTS:
- Name: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Tech: style="font-size:12px;color:#6B7280;margin:0 0 4px 0;"

CERTIFICATIONS:
style="font-size:13px;margin:0 0 5px 0;color:#374151;"

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;text-align:justify;"
`,
    },

    /* ─── 6. STARTUP FRESH ─── */
    {
        id: "startup-fresh",
        name: "Startup Fresh",
        description: "Bright orange accents with a youthful sans-serif look – energetic and fun.",
        category: "Modern",
        color: "#EA580C",
        previewBg: "#FFF7ED",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:18mm;box-sizing:border-box;font-family:'Poppins','Segoe UI',sans-serif;color:#292524;line-height:1.6;"

HEADER:
- Name: style="font-size:28px;font-weight:800;text-align:left;margin:0 0 4px 0;color:#EA580C;"
- Contact: style="font-size:12px;color:#78716C;text-align:left;margin:0 0 12px 0;" separator " • ".
- Divider: style="border:none;border-top:3px solid #FDBA74;margin:0 0 18px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:20px 0 10px 0;color:#EA580C;border-left:4px solid #EA580C;padding-left:10px;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#1C1917;"
- Company: style="font-size:12px;color:#78716C;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#44403C;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS follow the same pattern.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#44403C;text-align:justify;"
`,
    },

    /* ─── 7. DARK LUXE ─── */
    {
        id: "dark-luxe",
        name: "Dark Luxe",
        description: "Dark charcoal background with gold accents – premium and luxurious.",
        category: "Creative",
        color: "#D97706",
        previewBg: "#1C1917",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:#1C1917;padding:20mm;box-sizing:border-box;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#E7E5E4;line-height:1.65;"

HEADER:
- Name: style="font-size:32px;font-weight:800;text-align:center;margin:0 0 6px 0;letter-spacing:3px;color:#FBBF24;text-transform:uppercase;"
- Contact: style="font-size:12px;color:#A8A29E;text-align:center;margin:0 0 14px 0;" separator " | ".
- Divider: style="border:none;border-top:1px solid #44403C;margin:0 0 20px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #D97706;padding-bottom:4px;margin:22px 0 12px 0;color:#FBBF24;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#F5F5F4;"
- Company: style="font-size:12px;color:#A8A29E;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#D6D3D1;"

EDUCATION:
- Degree: style="font-size:14px;font-weight:600;margin:0;color:#F5F5F4;"
- Institution: style="font-size:12px;color:#A8A29E;margin:0 0 4px 0;"

SKILLS:
style="font-size:13px;margin:0 0 5px 0;color:#D6D3D1;"

PROJECTS:
- Name: style="font-size:14px;font-weight:600;margin:0;color:#F5F5F4;"
- Tech: style="font-size:12px;color:#A8A29E;margin:0 0 4px 0;"

CERTIFICATIONS:
style="font-size:13px;margin:0 0 5px 0;color:#D6D3D1;"

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#D6D3D1;text-align:justify;"
`,
    },

    /* ─── 8. SWISS DESIGN ─── */
    {
        id: "swiss-design",
        name: "Swiss Design",
        description: "Inspired by Swiss/International typography – grid-based, ultra clean.",
        category: "Classic",
        color: "#DC2626",
        previewBg: "#FEF2F2",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:20mm;box-sizing:border-box;font-family:'Helvetica','Arial',sans-serif;color:#18181B;line-height:1.55;"

HEADER:
- Name: style="font-size:36px;font-weight:900;text-align:left;margin:0 0 4px 0;color:#18181B;letter-spacing:-1px;"
- Contact: style="font-size:11px;color:#71717A;text-align:left;margin:0 0 14px 0;text-transform:uppercase;letter-spacing:1px;" separator " — ".
- Divider: style="border:none;border-top:4px solid #DC2626;margin:0 0 22px 0;"

SECTION TITLES:
style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;margin:24px 0 10px 0;color:#DC2626;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:700;margin:0;color:#18181B;"
- Company: style="font-size:12px;color:#71717A;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:16px;margin:4px 0 14px 0;list-style-type:none;" li style="font-size:13px;margin-bottom:4px;color:#3F3F46;" (prefix each li text with "→ ")

EDUCATION:
- Degree: style="font-size:14px;font-weight:700;margin:0;color:#18181B;"
- Institution: style="font-size:12px;color:#71717A;margin:0 0 4px 0;"

SKILLS:
style="font-size:13px;margin:0 0 5px 0;color:#3F3F46;"

PROJECTS:
- Name: style="font-size:14px;font-weight:700;margin:0;color:#18181B;"
- Tech: style="font-size:12px;color:#71717A;margin:0 0 4px 0;"

CERTIFICATIONS:
style="font-size:13px;margin:0 0 5px 0;color:#3F3F46;"

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#3F3F46;"
`,
    },

    /* ─── 9. GRADIENT WAVE ─── */
    {
        id: "gradient-wave",
        name: "Gradient Wave",
        description: "Purple-to-blue gradient header band, modern and eye-catching.",
        category: "Modern",
        color: "#7C3AED",
        previewBg: "#F5F3FF",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:0;box-sizing:border-box;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;color:#1F2937;line-height:1.6;"

HEADER: Wrap in a div style="background:linear-gradient(135deg,#7C3AED,#2563EB);padding:20mm 20mm 16mm 20mm;margin-bottom:20px;"
- Name: style="font-size:30px;font-weight:800;margin:0 0 6px 0;color:white;"
- Contact: style="font-size:12px;color:#DDD6FE;margin:0;" separator " · ".

Body wrapper: style="padding:0 20mm 20mm 20mm;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #7C3AED;padding-bottom:4px;margin:22px 0 12px 0;color:#7C3AED;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Company: style="font-size:12px;color:#6B7280;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#374151;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS follow the same body pattern.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;text-align:justify;"
`,
    },

    /* ─── 10. CREATIVE PORTFOLIO ─── */
    {
        id: "creative-portfolio",
        name: "Creative Portfolio",
        description: "Left-accented colored bar, bold colors, for designers and creatives.",
        category: "Creative",
        color: "#059669",
        previewBg: "#ECFDF5",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:20mm;box-sizing:border-box;font-family:'Outfit','Helvetica Neue',Arial,sans-serif;color:#1F2937;line-height:1.6;border-left:6px solid #059669;"

HEADER:
- Name: style="font-size:30px;font-weight:800;text-align:left;margin:0 0 4px 0;color:#059669;"
- Contact: style="font-size:12px;color:#6B7280;text-align:left;margin:0 0 14px 0;" separator " | ".
- Divider: style="border:none;border-top:1px solid #D1FAE5;margin:0 0 18px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:22px 0 10px 0;color:#059669;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Company: style="font-size:12px;color:#6B7280;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:circle;" li style="font-size:13px;margin-bottom:4px;color:#374151;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS follow the same pattern.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;text-align:justify;"
`,
    },

    /* ─── 11. PROFESSIONAL GRAY ─── */
    {
        id: "professional-gray",
        name: "Professional Gray",
        description: "Neutral gray palette with clean structure – universally professional.",
        category: "Classic",
        color: "#4B5563",
        previewBg: "#F3F4F6",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:20mm;box-sizing:border-box;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#374151;line-height:1.65;"

HEADER:
- Name: style="font-size:28px;font-weight:700;text-align:center;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:2px;color:#111827;"
- Contact: style="font-size:13px;color:#6B7280;text-align:center;margin:0 0 16px 0;" separator " | ".
- Divider: style="border:none;border-top:2px solid #9CA3AF;margin:0 0 20px 0;"

SECTION TITLES:
style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1.5px solid #D1D5DB;padding-bottom:4px;margin:20px 0 12px 0;color:#374151;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Company: style="font-size:12px;font-style:italic;color:#6B7280;margin:0 0 8px 0;"
- Bullets: ul style="padding-left:20px;margin:6px 0 16px 0;list-style-type:square;" li style="font-size:13px;margin-bottom:5px;color:#374151;text-align:justify;"

EDUCATION:
- Degree: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Institution: style="font-size:12px;font-style:italic;color:#6B7280;margin:0 0 4px 0;"

SKILLS:
style="font-size:13px;margin:0 0 6px 0;color:#374151;"

PROJECTS:
- Name: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Tech: style="font-size:12px;font-style:italic;color:#6B7280;margin:0 0 6px 0;"

CERTIFICATIONS:
style="font-size:13px;margin:0 0 6px 0;color:#374151;"

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;text-align:justify;"
`,
    },

    /* ─── 12. METRO CLEAN ─── */
    {
        id: "metro-clean",
        name: "Metro Clean",
        description: "Metro/flat UI inspired – strong headers, clean dividers, sky blue accent.",
        category: "Modern",
        color: "#0284C7",
        previewBg: "#F0F9FF",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:20mm;box-sizing:border-box;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;color:#1E293B;line-height:1.6;"

HEADER:
- Name: style="font-size:30px;font-weight:800;text-align:left;margin:0 0 4px 0;color:#0284C7;"
- Contact: style="font-size:12px;color:#64748B;text-align:left;margin:0 0 14px 0;" separator " · ".
- Divider: style="border:none;border-top:3px solid #0284C7;margin:0 0 18px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;background:#F0F9FF;padding:6px 10px;margin:20px 0 10px 0;color:#0284C7;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#0F172A;"
- Company: style="font-size:12px;color:#64748B;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#334155;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS follow the same pattern.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#334155;text-align:justify;"
`,
    },

    /* ─── 13. ACADEMIC FORMAL ─── */
    {
        id: "academic-formal",
        name: "Academic Formal",
        description: "Perfect for academia – centered header, traditional serif, deep green accents.",
        category: "Classic",
        color: "#166534",
        previewBg: "#F0FDF4",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:22mm 24mm;box-sizing:border-box;font-family:'Cambria','Georgia',serif;color:#1F2937;line-height:1.7;"

HEADER:
- Name: style="font-size:26px;font-weight:700;text-align:center;margin:0 0 6px 0;color:#166534;"
- Contact: style="font-size:11px;color:#6B7280;text-align:center;margin:0 0 14px 0;" separator " | ".
- Divider: style="border:none;border-top:1px solid #BBF7D0;margin:0 0 18px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #166534;padding-bottom:3px;margin:22px 0 12px 0;color:#166534;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Company: style="font-size:12px;font-style:italic;color:#6B7280;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:20px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#374151;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS similar serif styling.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;text-align:justify;"
`,
    },

    /* ─── 14. COMPACT PRO ─── */
    {
        id: "compact-pro",
        name: "Compact Pro",
        description: "Maximum content in minimal space – tight spacing, small font, no frills.",
        category: "Corporate",
        color: "#374151",
        previewBg: "#F9FAFB",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:15mm;box-sizing:border-box;font-family:'Arial',sans-serif;color:#1F2937;line-height:1.45;"

HEADER:
- Name: style="font-size:24px;font-weight:700;text-align:center;margin:0 0 4px 0;color:#111827;"
- Contact: style="font-size:11px;color:#6B7280;text-align:center;margin:0 0 10px 0;" separator " | ".
- Divider: style="border:none;border-top:1px solid #D1D5DB;margin:0 0 14px 0;"

SECTION TITLES:
style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #D1D5DB;padding-bottom:2px;margin:14px 0 8px 0;color:#374151;"

EXPERIENCE:
- Title: style="font-size:12px;font-weight:600;margin:0;color:#111827;"
- Company: style="font-size:11px;color:#6B7280;margin:0 0 4px 0;"
- Bullets: ul style="padding-left:16px;margin:2px 0 10px 0;list-style-type:disc;" li style="font-size:11.5px;margin-bottom:2px;color:#374151;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS similar compact sizing.

PROFESSIONAL SUMMARY:
style="font-size:11.5px;margin:0 0 4px 0;color:#374151;text-align:justify;"
`,
    },

    /* ─── 15. VIBRANT CYAN ─── */
    {
        id: "vibrant-cyan",
        name: "Vibrant Cyan",
        description: "Bright cyan accents with a bold header – fresh and modern.",
        category: "Modern",
        color: "#0891B2",
        previewBg: "#ECFEFF",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:20mm;box-sizing:border-box;font-family:'Roboto','Helvetica Neue',Arial,sans-serif;color:#1E293B;line-height:1.6;"

HEADER:
- Name: style="font-size:32px;font-weight:900;text-align:left;margin:0 0 4px 0;color:#0891B2;"
- Contact: style="font-size:12px;color:#64748B;text-align:left;margin:0 0 12px 0;" separator " • ".
- Divider: style="border:none;border-top:3px solid #22D3EE;margin:0 0 18px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:20px 0 10px 0;color:#0891B2;border-bottom:2px solid #CFFAFE;padding-bottom:4px;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#0F172A;"
- Company: style="font-size:12px;color:#64748B;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#334155;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS follow the same pattern.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#334155;text-align:justify;"
`,
    },

    /* ─── 16. MIDNIGHT ROYAL ─── */
    {
        id: "midnight-royal",
        name: "Midnight Royal",
        description: "Deep midnight blue theme with light text – regal and authoritative.",
        category: "Creative",
        color: "#312E81",
        previewBg: "#EEF2FF",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:#1E1B4B;padding:20mm;box-sizing:border-box;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#E0E7FF;line-height:1.65;"

HEADER:
- Name: style="font-size:30px;font-weight:800;text-align:center;margin:0 0 6px 0;color:#A5B4FC;letter-spacing:2px;text-transform:uppercase;"
- Contact: style="font-size:12px;color:#818CF8;text-align:center;margin:0 0 14px 0;" separator " | ".
- Divider: style="border:none;border-top:1px solid #3730A3;margin:0 0 20px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #4338CA;padding-bottom:4px;margin:22px 0 12px 0;color:#A5B4FC;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#E0E7FF;"
- Company: style="font-size:12px;color:#818CF8;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#C7D2FE;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS same light-on-dark styling.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#C7D2FE;text-align:justify;"
`,
    },

    /* ─── 17. WARM EARTH ─── */
    {
        id: "warm-earth",
        name: "Warm Earth",
        description: "Earthy brown tones with warm beige – natural and approachable.",
        category: "Classic",
        color: "#92400E",
        previewBg: "#FFFBEB",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:#FFFEF5;padding:22mm 20mm;box-sizing:border-box;font-family:'Palatino','Book Antiqua',serif;color:#292524;line-height:1.7;"

HEADER:
- Name: style="font-size:28px;font-weight:700;text-align:center;margin:0 0 6px 0;color:#92400E;letter-spacing:1px;"
- Contact: style="font-size:12px;color:#78716C;text-align:center;margin:0 0 14px 0;" separator " · ".
- Divider: style="border:none;border-top:2px solid #D6D3D1;margin:0 0 20px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1.5px solid #92400E;padding-bottom:4px;margin:22px 0 12px 0;color:#92400E;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#1C1917;"
- Company: style="font-size:12px;font-style:italic;color:#78716C;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#44403C;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS similar earthy tone.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#44403C;text-align:justify;"
`,
    },

    /* ─── 18. NEON DEVELOPER ─── */
    {
        id: "neon-developer",
        name: "Neon Developer",
        description: "Dark terminal look with neon green accents – for devs who code in the dark.",
        category: "Tech",
        color: "#22C55E",
        previewBg: "#14532D",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:#0A0A0A;padding:20mm;box-sizing:border-box;font-family:'Courier New','Lucida Console',monospace;color:#D4D4D4;line-height:1.6;"

HEADER:
- Name: style="font-size:28px;font-weight:700;text-align:left;margin:0 0 4px 0;color:#22C55E;"
- Contact: style="font-size:12px;color:#6B7280;text-align:left;margin:0 0 12px 0;" separator " | ".
- Divider: style="border:none;border-top:2px solid #22C55E;margin:0 0 18px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:20px 0 10px 0;color:#22C55E;" (prefix with "> ")

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#E5E5E5;"
- Company: style="font-size:12px;color:#737373;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:none;" li style="font-size:13px;margin-bottom:4px;color:#A3A3A3;" (prefix with "$ ")

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS same neon-on-dark style.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#A3A3A3;border-left:3px solid #22C55E;padding-left:10px;"
`,
    },

    /* ─── 19. MINIMAL SLATE ─── */
    {
        id: "minimal-slate",
        name: "Minimal Slate",
        description: "Ultra-minimal with subtle slate tones – let the content speak.",
        category: "Modern",
        color: "#475569",
        previewBg: "#F8FAFC",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:24mm;box-sizing:border-box;font-family:'Inter','system-ui',sans-serif;color:#334155;line-height:1.7;"

HEADER:
- Name: style="font-size:26px;font-weight:700;text-align:left;margin:0 0 4px 0;color:#0F172A;"
- Contact: style="font-size:11px;color:#94A3B8;text-align:left;margin:0 0 16px 0;" separator " · ".
- No divider.

SECTION TITLES:
style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:3px;margin:24px 0 10px 0;color:#94A3B8;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#0F172A;"
- Company: style="font-size:12px;color:#94A3B8;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:16px;margin:4px 0 14px 0;list-style-type:none;" li style="font-size:13px;margin-bottom:4px;color:#475569;" (prefix with "— ")

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS same minimal style.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#475569;"
`,
    },

    /* ─── 20. SAPPHIRE EDGE ─── */
    {
        id: "sapphire-edge",
        name: "Sapphire Edge",
        description: "Deep sapphire sidebar accent with clean white body – cutting edge.",
        category: "Corporate",
        color: "#1D4ED8",
        previewBg: "#EFF6FF",
        promptStyle: `
Main Container:
style="width:210mm;min-height:297mm;max-width:210mm;margin:0 auto;background:white;padding:20mm 20mm 20mm 28mm;box-sizing:border-box;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1F2937;line-height:1.6;border-left:8px solid #1D4ED8;"

HEADER:
- Name: style="font-size:30px;font-weight:800;text-align:left;margin:0 0 6px 0;color:#1D4ED8;"
- Contact: style="font-size:12px;color:#6B7280;text-align:left;margin:0 0 14px 0;" separator " | ".
- Divider: style="border:none;border-top:2px solid #BFDBFE;margin:0 0 18px 0;"

SECTION TITLES:
style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #1D4ED8;padding-bottom:4px;margin:22px 0 12px 0;color:#1D4ED8;"

EXPERIENCE:
- Title: style="font-size:14px;font-weight:600;margin:0;color:#111827;"
- Company: style="font-size:12px;color:#6B7280;margin:0 0 6px 0;"
- Bullets: ul style="padding-left:18px;margin:4px 0 14px 0;list-style-type:disc;" li style="font-size:13px;margin-bottom:4px;color:#374151;"

EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS follow the same pattern.

PROFESSIONAL SUMMARY:
style="font-size:13px;margin:0 0 6px 0;color:#374151;text-align:justify;"
`,
    },
];

export default templates;

export function getTemplateById(id: string): ResumeTemplate | undefined {
    return templates.find((t) => t.id === id);
}
