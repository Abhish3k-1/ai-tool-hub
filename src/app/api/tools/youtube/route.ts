import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Verified free models on OpenRouter (March 2026)
const FREE_MODELS = [
    'google/gemma-3-27b-it:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
    'nvidia/nemotron-3-nano-30b-a3b:free',
    'meta-llama/llama-3.2-3b-instruct:free',
];

async function callOpenRouter(modelName: string, systemPrompt: string, userPrompt: string) {
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
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });
}

async function fetchVideoMetadata(videoId: string): Promise<{ title: string; description: string } | null> {
    try {
        // Use YouTube's oEmbed endpoint (no API key needed)
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const res = await fetch(oembedUrl);
        if (res.ok) {
            const data = await res.json();
            return {
                title: data.title || '',
                description: data.author_name ? `Video by ${data.author_name}` : '',
            };
        }
    } catch (err) {
        console.error('[YouTube Summarizer] Failed to fetch oEmbed metadata:', err);
    }

    // Fallback: scrape the watch page for basic metadata
    try {
        const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const html = await watchRes.text();

        const titleMatch = html.match(/<title>(.+?)<\/title>/);
        const descMatch = html.match(/<meta name="description" content="(.+?)"/);

        return {
            title: titleMatch ? titleMatch[1].replace(' - YouTube', '').trim() : '',
            description: descMatch ? descMatch[1].trim() : '',
        };
    } catch (err) {
        console.error('[YouTube Summarizer] Failed to scrape metadata:', err);
    }

    return null;
}

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
        }

        // 1. Extract Video ID from URL
        let videoId = '';
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname.includes('youtube.com')) {
                videoId = parsedUrl.searchParams.get('v') || '';
            } else if (parsedUrl.hostname.includes('youtu.be')) {
                videoId = parsedUrl.pathname.slice(1);
            }
            if (videoId.includes('?')) {
                videoId = videoId.split('?')[0];
            }
        } catch {
            return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        }

        if (!videoId) {
            return NextResponse.json({ error: 'Invalid YouTube URL — could not extract Video ID' }, { status: 400 });
        }

        // 2. Try to fetch transcript
        let transcriptText = '';
        let usingFallback = false;

        try {
            const transcript = await YoutubeTranscript.fetchTranscript(videoId);
            transcriptText = transcript.map(t => t.text).join(' ');
        } catch (error: any) {
            console.warn('[YouTube Summarizer] Transcript unavailable:', error.message);
        }

        // 3. Fallback: use video metadata if transcript is unavailable
        if (!transcriptText.trim()) {
            console.log('[YouTube Summarizer] No transcript available, falling back to metadata...');
            const metadata = await fetchVideoMetadata(videoId);

            if (metadata && (metadata.title || metadata.description)) {
                transcriptText = `Video Title: ${metadata.title}\nVideo Description: ${metadata.description}\nVideo URL: https://www.youtube.com/watch?v=${videoId}`;
                usingFallback = true;
            } else {
                return NextResponse.json({
                    error: 'This video has no captions and no retrievable metadata. Please try a different video.'
                }, { status: 400 });
            }
        }

        // Limit transcript to ~4000 words to stay within free model token limits
        if (!usingFallback) {
            const words = transcriptText.split(/\s+/);
            if (words.length > 4000) {
                transcriptText = words.slice(0, 4000).join(' ') + '\n\n[Transcript truncated for length]';
            }
        }

        if (!OPENROUTER_API_KEY) {
            return NextResponse.json({ error: 'Server configuration error: OpenRouter API key is missing.' }, { status: 500 });
        }

        // 4. Build the prompt
        const systemPrompt = usingFallback
            ? 'Generate a detailed video summary based ONLY on the title and description. Structure with "Likely Content" and "Key Themes". Use markdown.'
            : 'Summarize the following transcript concisely with headers and key takeaways. Use markdown.';

        const userPrompt = usingFallback
            ? `Video Title: ${transcriptText}` // transcriptText contains metadata in fallback mode
            : `Transcript: ${transcriptText}`;

        // 5. Try each free model until one succeeds
        let lastError = '';
        for (const model of FREE_MODELS) {
            console.log(`[YouTube Summarizer] Trying model: ${model}`);
            try {
                const response = await callOpenRouter(model, systemPrompt, userPrompt);

                if (response.ok) {
                    const data = await response.json();
                    const summary = data.choices?.[0]?.message?.content;
                    if (summary) {
                        console.log(`[YouTube Summarizer] Success with model: ${model}`);
                        const prefix = usingFallback
                            ? '> ⚠️ **Note:** This summary is based on the video title and description because subtitles/captions were not available for this video.\n\n'
                            : '';
                        return NextResponse.json({ summary: prefix + summary });
                    }
                    lastError = 'AI returned an empty response.';
                } else if (response.status === 429) {
                    console.warn(`[YouTube Summarizer] Rate limited on ${model}, trying next...`);
                    lastError = 'Rate limited';
                } else {
                    const errorBody = await response.text();
                    console.warn(`[YouTube Summarizer] ${model} returned ${response.status}: ${errorBody.slice(0, 200)}`);
                    lastError = `${response.status}: ${response.statusText}`;
                }
            } catch (fetchErr: any) {
                console.error(`[YouTube Summarizer] Fetch error for ${model}:`, fetchErr.message);
                lastError = fetchErr.message;
            }
        }

        // All models failed
        return NextResponse.json({ 
            error: `AI generation failed — all free models are currently busy. Please wait 30 seconds and try again. (Last error: ${lastError})` 
        }, { status: 503 });

    } catch (error: any) {
        console.error('[YouTube Summarizer] Unexpected error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
