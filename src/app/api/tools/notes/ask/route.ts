import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
    if (!GROQ_API_KEY) {
        return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
    }

    try {
        const { question, context } = await req.json() as { question: string; context: string };

        if (!question || !context) {
            return NextResponse.json({ error: 'Missing question or context' }, { status: 400 });
        }

        const systemPrompt = `You are an intelligent knowledge-base assistant parsing a user's personal notes.
Use ONLY the provided context notes to answer the user's question. 
If the answer is not contained within the notes, decline politely and state that you cannot find the answer in their current notes. 
Do not hallucinate or use outside knowledge. Provide a clear, concise, and helpful answer.`;

        const userPrompt = `Context (User's Notes):\n${context}\n\nUser Question: ${question}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                temperature: 0.1, // Keep it grounded
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            console.error('[Notes AI Ask] API Error:', response.status);
            return NextResponse.json({ error: `AI request failed` }, { status: 500 });
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || 'No answer generated.';

        return NextResponse.json({ answer });
        
    } catch (error: unknown) {
        console.error('[Notes AI Ask] Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
