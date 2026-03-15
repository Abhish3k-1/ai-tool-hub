import { NextResponse } from 'next/server';
import { getTemplateById, type ResumeTemplate } from '@/lib/templates';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const MODELS = [
    'mistralai/mistral-7b-instruct:free',
    'openchat/openchat-7b:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-2-9b-it:free',
    'qwen/qwen-2.5-7b-instruct:free',
    'nousresearch/hermes-3-llama-3.1-8b:free',
    'google/gemma-3-27b-it:free',
    'nvidia/nemotron-3-nano-30b-a3b:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
];
const MAX_RETRY_ROUNDS = 3;
const RETRY_DELAY_MS = 2000;
const UNSAFE_LAYOUT_DECLARATION_REGEX =
    /(^|;)\s*(position\s*:\s*(absolute|fixed|sticky)|float\s*:\s*(left|right)|z-index\s*:[^;]*|left\s*:[^;]*|right\s*:[^;]*|top\s*:[^;]*|bottom\s*:[^;]*|transform\s*:[^;]*|columns?\s*:[^;]*|column-count\s*:[^;]*|column-gap\s*:[^;]*)/gi;

type HeaderType = 'plain' | 'band';
type SectionType = 'underline' | 'caps' | 'leftbar' | 'minimal' | 'boxed';

interface FallbackTemplatePreset {
    fontFamily: string;
    headerType: HeaderType;
    sectionType: SectionType;
    align: 'left' | 'center';
    divider: 'none' | 'solid' | 'double';
    leftBorder: boolean;
    dark: boolean;
    compact: boolean;
    uppercaseName: boolean;
}

const TEMPLATE_PRESETS: Record<string, FallbackTemplatePreset> = {
    'modern-minimalist': { fontFamily: "Inter, Arial, sans-serif", headerType: 'plain', sectionType: 'underline', align: 'center', divider: 'solid', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'executive-classic': { fontFamily: "Georgia, 'Times New Roman', serif", headerType: 'plain', sectionType: 'underline', align: 'center', divider: 'double', leftBorder: false, dark: false, compact: false, uppercaseName: true },
    'tech-bold': { fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif", headerType: 'plain', sectionType: 'boxed', align: 'left', divider: 'solid', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'elegant-serif': { fontFamily: "'Playfair Display', Georgia, serif", headerType: 'plain', sectionType: 'underline', align: 'center', divider: 'solid', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'corporate-blue': { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", headerType: 'band', sectionType: 'underline', align: 'left', divider: 'none', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'startup-fresh': { fontFamily: "Poppins, 'Segoe UI', sans-serif", headerType: 'plain', sectionType: 'leftbar', align: 'left', divider: 'solid', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'dark-luxe': { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", headerType: 'plain', sectionType: 'underline', align: 'center', divider: 'solid', leftBorder: false, dark: true, compact: false, uppercaseName: true },
    'swiss-design': { fontFamily: "Helvetica, Arial, sans-serif", headerType: 'plain', sectionType: 'caps', align: 'left', divider: 'solid', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'gradient-wave': { fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", headerType: 'band', sectionType: 'underline', align: 'left', divider: 'none', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'creative-portfolio': { fontFamily: "Outfit, 'Helvetica Neue', Arial, sans-serif", headerType: 'plain', sectionType: 'caps', align: 'left', divider: 'solid', leftBorder: true, dark: false, compact: false, uppercaseName: false },
    'professional-gray': { fontFamily: "Arial, sans-serif", headerType: 'plain', sectionType: 'underline', align: 'left', divider: 'solid', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'metro-clean': { fontFamily: "'Segoe UI', Arial, sans-serif", headerType: 'plain', sectionType: 'boxed', align: 'left', divider: 'solid', leftBorder: false, dark: false, compact: true, uppercaseName: false },
    'academic-formal': { fontFamily: "Cambria, Georgia, serif", headerType: 'plain', sectionType: 'underline', align: 'left', divider: 'double', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'compact-pro': { fontFamily: "Arial, sans-serif", headerType: 'plain', sectionType: 'minimal', align: 'left', divider: 'solid', leftBorder: false, dark: false, compact: true, uppercaseName: false },
    'vibrant-cyan': { fontFamily: "'Trebuchet MS', Arial, sans-serif", headerType: 'band', sectionType: 'leftbar', align: 'left', divider: 'none', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'midnight-royal': { fontFamily: "'Segoe UI', Arial, sans-serif", headerType: 'band', sectionType: 'underline', align: 'left', divider: 'none', leftBorder: false, dark: true, compact: false, uppercaseName: false },
    'warm-earth': { fontFamily: "Georgia, serif", headerType: 'plain', sectionType: 'underline', align: 'center', divider: 'solid', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'neon-developer': { fontFamily: "'Courier New', monospace", headerType: 'plain', sectionType: 'caps', align: 'left', divider: 'solid', leftBorder: false, dark: true, compact: false, uppercaseName: false },
    'minimal-slate': { fontFamily: "Inter, system-ui, sans-serif", headerType: 'plain', sectionType: 'minimal', align: 'left', divider: 'none', leftBorder: false, dark: false, compact: false, uppercaseName: false },
    'sapphire-edge': { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", headerType: 'plain', sectionType: 'underline', align: 'left', divider: 'solid', leftBorder: true, dark: false, compact: false, uppercaseName: false },
};

interface ExperienceItem {
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

interface EducationItem {
    degree?: string;
    institution?: string;
    location?: string;
    graduationDate?: string;
    gradeValue?: string;
}

interface ProjectItem {
    name?: string;
    technologies?: string;
    description?: string;
    link?: string;
}

interface CertificationItem {
    name?: string;
    issuer?: string;
    date?: string;
}

interface ResumeRequestBody {
    templateId?: string;
    targetRole?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    skills?: string[];
    softSkills?: string[];
    languages?: string[];
    experience?: ExperienceItem[];
    education?: EducationItem[];
    projects?: ProjectItem[];
    certifications?: CertificationItem[];
}

type FilteredResumeData = Omit<ResumeRequestBody, 'templateId'>;

interface OpenRouterResponse {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callOpenRouter(modelName: string, prompt: string) {
    return await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'AI Tools Hub',
        },
        body: JSON.stringify({
            model: modelName,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert resume writer. You generate resume HTML using ONLY the data provided. You NEVER invent, fabricate, or assume any information. If a field is empty or missing, you skip that section entirely.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    });
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sanitizeModelHtml(rawHtml: string) {
    let html = rawHtml
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .replace(/oklch\([^)]*\)/gi, '#111111')
        .replace(/oklab\([^)]*\)/gi, '#111111')
        .replace(/lab\([^)]*\)/gi, '#111111');

    html = normalizeMojibake(html);
    html = sanitizeInlineStylesInHtml(html);
    html = stabilizeRootContainer(html);
    html = stabilizeContactLine(html);

    return html.trim();
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function normalizeMojibake(html: string) {
    return html
        .replace(/Â·/g, '·')
        .replace(/â€¢/g, '•')
        .replace(/â€”/g, '—')
        .replace(/â€“/g, '–')
        .replace(/âœ¦/g, '✦')
        .replace(/[─━]{2,}/g, '');
}

function sanitizeInlineCss(styleText: string) {
    return styleText
        .replace(UNSAFE_LAYOUT_DECLARATION_REGEX, '$1')
        .replace(/\s*;\s*;\s*/g, ';')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function sanitizeInlineStylesInHtml(html: string) {
    return html.replace(/style="([^"]*)"/gi, (_match, styleText: string) => {
        const safeStyle = sanitizeInlineCss(styleText);
        return `style="${safeStyle}"`;
    });
}

function appendStyleToTagAttributes(attributes: string, styleFragment: string) {
    if (/style="/i.test(attributes)) {
        return attributes.replace(/style="([^"]*)"/i, (_m, existingStyle: string) => {
            const needsSemicolon = existingStyle.trim().endsWith(';') ? '' : ';';
            return `style="${existingStyle}${needsSemicolon}${styleFragment}"`;
        });
    }
    return `${attributes} style="${styleFragment}"`;
}

function stabilizeRootContainer(html: string) {
    const rootStyle =
        'width:210mm;min-height:297mm;max-width:210mm;box-sizing:border-box;word-wrap:break-word;overflow-wrap:break-word;';

    if (/^<div[^>]*style="/i.test(html)) {
        return html.replace(/^<div([^>]*)style="([^"]*)"([^>]*)>/i, (_match, before: string, styleText: string, after: string) => {
            const needsSemicolon = styleText.trim().endsWith(';') ? '' : ';';
            return `<div${before}style="${styleText}${needsSemicolon}${rootStyle}"${after}>`;
        });
    }

    return html.replace(/^<div([^>]*)>/i, `<div$1 style="${rootStyle}">`);
}

function stabilizeContactLine(html: string) {
    return html.replace(
        /<p([^>]*)>([^<]*(?:@|(?:\+?\d[\d\s().-]{6,})).*?)<\/p>/i,
        (_match, attributes: string, content: string) => {
            const normalizedContent = content
                .replace(/\s*[·•∙]\s*/g, ' | ')
                .replace(/\s*\|\s*/g, ' | ')
                .replace(/\s{2,}/g, ' ')
                .trim();

            const safeAttributes = appendStyleToTagAttributes(
                attributes,
                'line-height:1.35;word-break:break-word;overflow-wrap:anywhere;'
            );
            return `<p${safeAttributes}>${normalizedContent}</p>`;
        }
    );
}

function getFallbackPreset(template?: ResumeTemplate): FallbackTemplatePreset {
    if (!template) {
        return TEMPLATE_PRESETS['modern-minimalist'];
    }
    return TEMPLATE_PRESETS[template.id] || TEMPLATE_PRESETS['modern-minimalist'];
}

function buildFallbackResumeHtml(data: FilteredResumeData, template?: ResumeTemplate) {
    const preset = getFallbackPreset(template);
    const accent = template?.color || '#4F46E5';

    const textColor = preset.dark ? '#E5E7EB' : '#111111';
    const mutedColor = preset.dark ? '#A1A1AA' : '#4B5563';
    const surfaceColor = preset.dark ? '#111827' : '#FFFFFF';
    const borderTone = preset.dark ? '#374151' : '#E5E7EB';
    const sectionBodyColor = preset.dark ? '#D1D5DB' : '#374151';
    const basePadding = preset.compact ? '18mm' : '22mm';

    const name = data.fullName ? escapeHtml(data.fullName) : 'Professional Resume';
    const targetRole = data.targetRole ? escapeHtml(data.targetRole) : '';
    const displayName = preset.uppercaseName ? name.toUpperCase() : name;

    const contactParts = [data.email, data.phone, data.location, data.linkedin]
        .filter(isNonEmptyString)
        .map((part) => escapeHtml(part));

    const skills = (data.skills || []).filter(Boolean).map((s: string) => escapeHtml(String(s)));
    const softSkills = (data.softSkills || []).filter(Boolean).map((s: string) => escapeHtml(String(s)));
    const languages = (data.languages || []).filter(Boolean).map((s: string) => escapeHtml(String(s)));

    const renderSectionTitle = (title: string) => {
        if (preset.sectionType === 'boxed') {
            return `<h2 style="display:inline-block;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px 0;color:#ffffff;background:${accent};padding:5px 10px;border-radius:4px;">${title}</h2>`;
        }

        if (preset.sectionType === 'leftbar') {
            return `<h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px 0;color:${accent};border-left:4px solid ${accent};padding-left:10px;">${title}</h2>`;
        }

        if (preset.sectionType === 'caps') {
            return `<h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:3px;margin:0 0 10px 0;color:${accent};">${title}</h2>`;
        }

        if (preset.sectionType === 'minimal') {
            return `<h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;margin:0 0 10px 0;color:${mutedColor};">${title}</h2>`;
        }

        return `<h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid ${borderTone};padding-bottom:4px;margin:0 0 10px 0;color:${accent};">${title}</h2>`;
    };

    const renderSection = (title: string, content: string) => {
        if (!content.trim()) return '';
        return `<section style="margin-top:${preset.compact ? '14px' : '18px'};">
    ${renderSectionTitle(title)}
    ${content}
  </section>`;
    };

    const listTone = preset.dark ? '#D1D5DB' : '#374151';

    const experienceHtml = (data.experience || [])
        .map((e) => {
            const role = [e.title, e.company].filter(isNonEmptyString).map((v) => escapeHtml(v)).join(' - ');
            const meta = [e.location, e.startDate, e.endDate].filter(isNonEmptyString).map((v) => escapeHtml(v)).join(' | ');
            const desc = e.description ? escapeHtml(String(e.description)).replace(/\n/g, '<br/>') : '';
            if (!role && !meta && !desc) return '';
            return `<div style="margin-bottom:12px;">
      ${role ? `<p style="margin:0;font-weight:700;color:${textColor};">${role}</p>` : ''}
      ${meta ? `<p style="margin:2px 0 0 0;font-size:12px;color:${mutedColor};">${meta}</p>` : ''}
      ${desc ? `<p style="margin:6px 0 0 0;font-size:13px;line-height:1.5;color:${listTone};">${desc}</p>` : ''}
    </div>`;
        })
        .join('');

    const educationHtml = (data.education || [])
        .map((e) => {
            const line1 = [e.degree, e.institution].filter(isNonEmptyString).map((v) => escapeHtml(v)).join(' - ');
            const line2 = [e.location, e.graduationDate, e.gradeValue].filter(isNonEmptyString).map((v) => escapeHtml(v)).join(' | ');
            if (!line1 && !line2) return '';
            return `<div style="margin-bottom:10px;">
      ${line1 ? `<p style="margin:0;font-weight:700;color:${textColor};">${line1}</p>` : ''}
      ${line2 ? `<p style="margin:2px 0 0 0;font-size:12px;color:${mutedColor};">${line2}</p>` : ''}
    </div>`;
        })
        .join('');

    const projectsHtml = (data.projects || [])
        .map((p) => {
            const nameText = p.name ? escapeHtml(String(p.name)) : '';
            const tech = p.technologies ? escapeHtml(String(p.technologies)) : '';
            const desc = p.description ? escapeHtml(String(p.description)).replace(/\n/g, '<br/>') : '';
            const link = p.link ? escapeHtml(String(p.link)) : '';
            if (!nameText && !tech && !desc && !link) return '';
            return `<div style="margin-bottom:12px;">
      ${nameText ? `<p style="margin:0;font-weight:700;color:${textColor};">${nameText}</p>` : ''}
      ${tech ? `<p style="margin:2px 0 0 0;font-size:12px;color:${mutedColor};">Tech: ${tech}</p>` : ''}
      ${desc ? `<p style="margin:6px 0 0 0;font-size:13px;line-height:1.5;color:${sectionBodyColor};">${desc}</p>` : ''}
      ${link ? `<p style="margin:4px 0 0 0;font-size:12px;color:${accent};">${link}</p>` : ''}
    </div>`;
        })
        .join('');

    const certificationsHtml = (data.certifications || [])
        .map((c) => {
            const line = [c.name, c.issuer, c.date].filter(isNonEmptyString).map((v) => escapeHtml(v)).join(' | ');
            if (!line) return '';
            return `<p style="margin:0 0 6px 0;font-size:13px;line-height:1.4;color:${sectionBodyColor};">${line}</p>`;
        })
        .join('');

    const contactText = contactParts.join(' | ');
    const dividerStyle =
        preset.divider === 'none'
            ? ''
            : preset.divider === 'double'
                ? `border:none;border-top:3px double ${accent};margin:0 0 18px 0;`
                : `border:none;border-top:2px solid ${borderTone};margin:0 0 18px 0;`;

    const headerBlock = preset.headerType === 'band'
        ? `<header style="background:${accent};padding:${preset.compact ? '14mm' : '16mm'} ${basePadding};margin:${preset.leftBorder ? `0 0 18px ${basePadding}` : '0 0 18px 0'};">
    <h1 style="font-size:${preset.compact ? '26px' : '30px'};line-height:1.2;margin:0;color:#ffffff;font-weight:800;text-align:${preset.align};letter-spacing:${preset.uppercaseName ? '1.2px' : '0.3px'};">${displayName}</h1>
    ${targetRole ? `<p style="margin:8px 0 0 0;font-size:13px;color:#e5e7eb;font-weight:600;text-align:${preset.align};">${targetRole}</p>` : ''}
    ${contactText ? `<p style="margin:8px 0 0 0;font-size:12px;color:#dbeafe;text-align:${preset.align};">${contactText}</p>` : ''}
  </header>`
        : `<header style="margin:0 0 6px 0;">
    <h1 style="font-size:${preset.compact ? '24px' : '30px'};line-height:1.2;margin:0;color:${accent};font-weight:800;text-align:${preset.align};letter-spacing:${preset.uppercaseName ? '1.2px' : '0.3px'};">${displayName}</h1>
    ${targetRole ? `<p style="margin:8px 0 0 0;font-size:14px;color:${mutedColor};font-weight:600;text-align:${preset.align};">${targetRole}</p>` : ''}
    ${contactText ? `<p style="margin:8px 0 0 0;font-size:12px;color:${mutedColor};text-align:${preset.align};">${contactText}</p>` : ''}
    ${dividerStyle ? `<hr style="${dividerStyle}" />` : ''}
  </header>`;

    return `<div style="width:210mm;min-height:297mm;box-sizing:border-box;padding:${basePadding};background:${surfaceColor};color:${textColor};font-family:${preset.fontFamily};line-height:${preset.compact ? '1.4' : '1.55'};word-wrap:break-word;${preset.leftBorder ? `border-left:8px solid ${accent};padding-left:28mm;` : ''}">
  ${headerBlock}
  ${renderSection('Skills', skills.length ? `<p style="margin:0;font-size:13px;color:${sectionBodyColor};">${skills.join(', ')}</p>` : '')}
  ${renderSection('Soft Skills', softSkills.length ? `<p style="margin:0;font-size:13px;color:${sectionBodyColor};">${softSkills.join(', ')}</p>` : '')}
  ${renderSection('Languages', languages.length ? `<p style="margin:0;font-size:13px;color:${sectionBodyColor};">${languages.join(', ')}</p>` : '')}
  ${renderSection('Experience', experienceHtml)}
  ${renderSection('Education', educationHtml)}
  ${renderSection('Projects', projectsHtml)}
  ${renderSection('Certifications', certificationsHtml)}
</div>`;
}

function filterResumeData(body: ResumeRequestBody): FilteredResumeData {
    const filtered: FilteredResumeData = {};

    if (body.targetRole) filtered.targetRole = body.targetRole;
    if (body.fullName) filtered.fullName = body.fullName;
    if (body.email) filtered.email = body.email;
    if (body.phone) filtered.phone = body.phone;
    if (body.location) filtered.location = body.location;
    if (body.linkedin) filtered.linkedin = body.linkedin;

    const experience = (body.experience || []).filter((e) => isNonEmptyString(e.title) || isNonEmptyString(e.company));
    if (experience.length > 0) filtered.experience = experience;

    const education = (body.education || []).filter((e) => isNonEmptyString(e.degree) || isNonEmptyString(e.institution));
    if (education.length > 0) filtered.education = education;

    const skills = (body.skills || []).filter((s) => isNonEmptyString(s));
    if (skills.length > 0) filtered.skills = skills;

    const softSkills = (body.softSkills || []).filter((s) => isNonEmptyString(s));
    if (softSkills.length > 0) filtered.softSkills = softSkills;

    const languages = (body.languages || []).filter((l) => isNonEmptyString(l));
    if (languages.length > 0) filtered.languages = languages;

    const projects = (body.projects || []).filter((p) => isNonEmptyString(p.name));
    if (projects.length > 0) filtered.projects = projects;

    const certifications = (body.certifications || []).filter((c) => isNonEmptyString(c.name));
    if (certifications.length > 0) filtered.certifications = certifications;

    return filtered;
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as ResumeRequestBody;

        if (!OPENROUTER_API_KEY) {
            console.error('Missing OpenRouter API Key');
            return NextResponse.json({ error: 'Server configuration error: OpenRouter API key is missing.' }, { status: 500 });
        }

        // Filter out empty fields so the AI doesn't invent data
        const filteredData = filterResumeData(body);

        // Get the selected template styling
        const template = getTemplateById(body.templateId || '');
        const templateStyle = template ? template.promptStyle : '';
        const templateName = template ? template.name : 'Modern Minimalist';

const prompt = `Generate a professional resume as a SINGLE HTML div.
Data (ONLY use this): ${JSON.stringify(filteredData)}

Rules:
1. NO invented info. Skip empty sections.
2. A4 size (210mm x 297mm). Use word-wrap:break-word.
3. Inline CSS ONLY. 
4. CRITICAL: Use ONLY standard colors (hex, rgb, or names). NEVER use oklch(), lab(), or oklab() as they crash the PDF generator.
5. ORDER: Name, CI, Summary, Education, Skills, Projects, Certs, Exp.
6. Template: ${templateName}. Style: ${templateStyle || 'Arial, name: 28px, body: 12px'}
7. The output MUST look visibly different from other templates, with layout/typography matching the selected template.
8. Contact line must use plain " | " separators only. Avoid decorative symbols and line-drawing characters.`;

        let lastError = '';

        // Retry up to 3 times (rounds) and, in each round, try models sequentially.
        for (let round = 1; round <= MAX_RETRY_ROUNDS; round++) {
            console.log(`[Resume Generator] Retry round ${round}/${MAX_RETRY_ROUNDS}`);

            for (const model of MODELS) {
                console.log('Trying model:', model);

                try {
                    const response = await callOpenRouter(model, prompt);

                    if (response.ok) {
                        const data = (await response.json()) as OpenRouterResponse;
                        let generatedHtml = data.choices?.[0]?.message?.content;

                        if (generatedHtml) {
                            generatedHtml = sanitizeModelHtml(generatedHtml);
                            console.log(`[Resume Generator] Success with model: ${model}`);
                            return NextResponse.json({ html: generatedHtml });
                        }

                        lastError = 'AI returned an empty response.';
                    } else if (response.status === 429) {
                        // Explicit rate-limit fallback to next model
                        lastError = `429 rate limited on ${model}`;
                        console.log('Rate limited, switching model');
                    } else {
                        const errorBody = await response.text();
                        lastError = `${response.status}: ${response.statusText}`;
                        console.warn(`[Resume Generator] ${model} returned ${response.status}: ${errorBody.slice(0, 200)}`);
                        console.log('Request failed, switching model');
                    }
                } catch (fetchErr: unknown) {
                    const message = fetchErr instanceof Error ? fetchErr.message : 'Unknown fetch error';
                    lastError = message;
                    console.error(`[Resume Generator] Fetch error for ${model}:`, message);
                    console.log('Request failed, switching model');
                }

                // Delay 2s between failed attempts/model fallbacks.
                await delay(RETRY_DELAY_MS);
            }
        }

        console.warn('[Resume Generator] All models failed. Returning deterministic fallback resume HTML. Last error:', lastError || 'Unknown error');
        const fallbackHtml = buildFallbackResumeHtml(filteredData, template);
        return NextResponse.json({ html: fallbackHtml });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'AI resume generation failed';
        console.error('[Resume Generator] Unexpected error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
