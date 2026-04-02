import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

type AIAction = 'improve' | 'summarize' | 'expand' | 'grammar' | 'bullets' | 'ideas';

function buildSystemPrompt(action: AIAction): string {
    const base = "You are an expert AI writing assistant integrated into a premium productivity app. Provide ONLY the final text as an HTML snippet (e.g. use <p>, <ul>, <li>, <strong>, <h1>, etc.). Do NOT include markdown blocks like ```html. Do not include introductory or concluding conversational text. Just give the raw improved HTML content.";
    
    switch (action) {
        case 'improve':
            return `${base} Your task is to rewrite the provided text to be clearer, more professional, and highly engaging.`;
        case 'summarize':
            return `${base} Your task is to create a concise, hard-hitting summary of the text. Focus on the main points.`;
        case 'expand':
            return `${base} Your task is to expand the provided text. Add relevant details, examples, and depth while maintaining the original tone.`;
        case 'grammar':
            return `${base} Your task is to fix all grammar, spelling, and structural issues in the text without changing its original meaning or style.`;
        case 'bullets':
            return `${base} Your task is to convert the provided text into a clean, hierarchical HTML unordered list (<ul>/<li> format). Distill to the most important points.`;
        case 'ideas':
            return `${base} Your task is to generate 5-7 creative ideas, brainstorm points, or an outline based on the provided text/title. Make it highly structured using heading and list HTML tags.`;
        default:
            return base;
    }
}

export async function POST(req: Request) {
    if (!GROQ_API_KEY) {
        return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
    }

    try {
        const { text, action } = await req.json() as { text: string; action: AIAction };

        if (!text || !action) {
            return NextResponse.json({ error: 'Missing text or action' }, { status: 400 });
        }

        const systemPrompt = buildSystemPrompt(action);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                temperature: 0.3,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Here is the text:\n\n${text}` },
                ],
                max_tokens: 2048,
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('[Notes AI] API Error:', response.status, errBody);
            return NextResponse.json({ error: `AI request failed: ${response.statusText}` }, { status: 500 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Strip markdown backticks if the model ignores our instruction not to use them
        let cleanContent = content;
        if (cleanContent.startsWith('```html')) {
            cleanContent = cleanContent.replace(/^```html/, '').replace(/```$/, '').trim();
        } else if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/^```/, '').replace(/```$/, '').trim();
        }

        return NextResponse.json({ result: cleanContent });
        
    } catch (error: unknown) {
        console.error('[Notes AI] Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
