import { NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/templates';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const FREE_MODELS = [
    'google/gemma-3-27b-it:free',
    'nvidia/nemotron-3-nano-30b-a3b:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
];

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

function filterResumeData(body: any) {
    const filtered: any = {};

    if (body.targetRole) filtered.targetRole = body.targetRole;
    if (body.fullName) filtered.fullName = body.fullName;
    if (body.email) filtered.email = body.email;
    if (body.phone) filtered.phone = body.phone;
    if (body.location) filtered.location = body.location;
    if (body.linkedin) filtered.linkedin = body.linkedin;

    const experience = (body.experience || []).filter((e: any) => e.title || e.company);
    if (experience.length > 0) filtered.experience = experience;

    const education = (body.education || []).filter((e: any) => e.degree || e.institution);
    if (education.length > 0) filtered.education = education;

    const skills = (body.skills || []).filter((s: string) => s.trim());
    if (skills.length > 0) filtered.skills = skills;

    const softSkills = (body.softSkills || []).filter((s: string) => s.trim());
    if (softSkills.length > 0) filtered.softSkills = softSkills;

    const languages = (body.languages || []).filter((l: string) => l.trim());
    if (languages.length > 0) filtered.languages = languages;

    const projects = (body.projects || []).filter((p: any) => p.name);
    if (projects.length > 0) filtered.projects = projects;

    const certifications = (body.certifications || []).filter((c: any) => c.name);
    if (certifications.length > 0) filtered.certifications = certifications;

    return filtered;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

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
6. Template: ${templateName}. Style: ${templateStyle || 'Arial, name: 28px, body: 12px'}`;

        let lastError = '';
        for (const model of FREE_MODELS) {
            console.log(`[Resume Generator] Trying model: ${model}`);

            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    if (attempt > 0) {
                        console.log(`[Resume Generator] Retry ${attempt + 1} for ${model}...`);
                        await delay(3000);
                    }

                    const response = await callOpenRouter(model, prompt);

                    if (response.ok) {
                        const data = await response.json();
                        let generatedHtml = data.choices?.[0]?.message?.content;
                        if (generatedHtml) {
                            // Strip markdown code fences if the AI wraps them
                            generatedHtml = generatedHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim();
                            console.log(`[Resume Generator] Success with model: ${model}`);
                            return NextResponse.json({ html: generatedHtml });
                        }
                        lastError = 'AI returned an empty response.';
                    } else if (response.status === 429) {
                        console.warn(`[Resume Generator] Rate limited on ${model} (attempt ${attempt + 1})`);
                        lastError = 'Rate limited';
                    } else {
                        const errorBody = await response.text();
                        console.warn(`[Resume Generator] ${model} returned ${response.status}: ${errorBody.slice(0, 200)}`);
                        lastError = `${response.status}: ${response.statusText}`;
                        break;
                    }
                } catch (fetchErr: any) {
                    console.error(`[Resume Generator] Fetch error for ${model}:`, fetchErr.message);
                    lastError = fetchErr.message;
                    break;
                }
            }
        }

        return NextResponse.json({
            error: `AI resume generation failed — all free models are currently busy. Please wait 30 seconds and try again. (Last error: ${lastError})`
        }, { status: 503 });

    } catch (error: any) {
        console.error('[Resume Generator] Unexpected error:', error);
        return NextResponse.json({ error: error.message || 'AI resume generation failed' }, { status: 500 });
    }
}
