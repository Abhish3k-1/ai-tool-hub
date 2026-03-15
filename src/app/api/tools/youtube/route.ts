import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Free-tier models rotated in order.
const FREE_MODELS = [
    'google/gemma-3-27b-it:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
    'nvidia/nemotron-3-nano-30b-a3b:free',
    'meta-llama/llama-3.2-3b-instruct:free',
];

const MAX_RETRY_ROUNDS = 3;
const RETRY_DELAY_MS = 2000;
const MAX_TRANSCRIPT_WORDS = 4000;

type SourceMode = 'transcript' | 'metadata' | 'minimal';

type TranscriptSegment = {
    text: string;
    offset: number;
    duration: number;
};

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(input: string) {
    return input
        .replace(/\s+/g, ' ')
        .replace(/[^\S\r\n]+/g, ' ')
        .trim();
}

function sanitizeTranscriptText(text: string) {
    return normalizeText(
        text
            .replace(/\[(music|applause|laughter|inaudible|silence)\]/gi, '')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
    );
}

function isLikelyEnglish(text: string) {
    const latinChars = (text.match(/[A-Za-z]/g) || []).length;
    const nonAsciiChars = (text.match(/[^\x00-\x7F]/g) || []).length;
    return latinChars >= 40 || latinChars >= nonAsciiChars * 2;
}

function uniqueWordRatio(text: string) {
    const words = (text.toLowerCase().match(/\b[a-z][a-z0-9'-]{1,}\b/g) || []).filter(Boolean);
    if (!words.length) return 0;
    return new Set(words).size / words.length;
}

function isLowQualitySummary(summary: string) {
    const normalized = normalizeText(summary);
    if (!normalized) return true;
    if (normalized.length < 180) return true;
    if (uniqueWordRatio(normalized) < 0.18) return true;

    const badPatterns = [
        /as an ai language model/i,
        /i cannot access/i,
        /unable to summarize/i,
        /no transcript available/i,
        /lorem ipsum/i,
    ];

    return badPatterns.some((pattern) => pattern.test(normalized));
}

const STOPWORDS = new Set([
    'the', 'and', 'for', 'with', 'from', 'this', 'that', 'were', 'have', 'has', 'had', 'you',
    'your', 'into', 'about', 'video', 'summary', 'based', 'only', 'using', 'their', 'there',
    'these', 'those', 'they', 'them', 'will', 'would', 'should', 'could', 'can', 'more',
    'also', 'than', 'when', 'where', 'what', 'which', 'while', 'because', 'been', 'being',
    'very', 'just', 'then', 'them', 'such', 'over', 'under', 'after', 'before', 'during',
]);

function splitIntoSentences(text: string) {
    const normalized = text
        .replace(/\s+/g, ' ')
        .replace(/([.!?])\s+(?=[A-Z])/g, '$1|');
    return normalized
        .split('|')
        .map((s) => s.trim())
        .filter((s) => s.length > 35);
}

function extractEnglishTerms(text: string, maxTerms = 10) {
    const matches = text.match(/\b[A-Za-z][A-Za-z0-9+-]{2,}\b/g) || [];
    const counts = new Map<string, number>();

    for (const rawWord of matches) {
        const word = rawWord.toLowerCase();
        if (STOPWORDS.has(word)) continue;
        counts.set(word, (counts.get(word) || 0) + 1);
    }

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxTerms)
        .map(([word]) => word);
}

function pickTopSentences(sentences: string[], maxCount = 5) {
    if (sentences.length <= maxCount) return sentences;

    const frequency = new Map<string, number>();
    for (const sentence of sentences) {
        const words = sentence.toLowerCase().match(/\b[a-z][a-z0-9'-]{2,}\b/g) || [];
        for (const word of words) {
            if (STOPWORDS.has(word)) continue;
            frequency.set(word, (frequency.get(word) || 0) + 1);
        }
    }

    const scored = sentences.map((sentence, index) => {
        const words = sentence.toLowerCase().match(/\b[a-z][a-z0-9'-]{2,}\b/g) || [];
        let score = 0;
        for (const word of words) {
            score += frequency.get(word) || 0;
        }
        const normalizedScore = score / Math.sqrt(Math.max(words.length, 1));
        return { sentence, index, score: normalizedScore };
    });

    const selected = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, maxCount)
        .sort((a, b) => a.index - b.index)
        .map((item) => item.sentence);

    return selected;
}

function estimateMinutes(segments: TranscriptSegment[], wordsCount: number) {
    const maxSeconds = segments.reduce((maxValue, seg) => {
        const end = Math.max(0, seg.offset) + Math.max(0, seg.duration);
        return Math.max(maxValue, end);
    }, 0);

    if (maxSeconds > 0) return Math.max(1, Math.round(maxSeconds / 60));
    return Math.max(1, Math.round(wordsCount / 150));
}

function buildDeterministicSummary(params: {
    sourceText: string;
    sourceMode: SourceMode;
    videoUrl: string;
    segments: TranscriptSegment[];
    metadata: { title: string; description: string } | null;
    reason: string;
}) {
    const { sourceText, sourceMode, videoUrl, segments, metadata, reason } = params;

    const normalized = normalizeText(sourceText);
    const words = normalized.split(/\s+/).filter(Boolean);
    const sentences = splitIntoSentences(normalized);
    const selected = pickTopSentences(sentences, 5);
    const terms = extractEnglishTerms(normalized, 10);
    const minutes = estimateMinutes(segments, words.length);

    const titleLine = metadata?.title ? `**Video title:** ${metadata.title}` : '';
    const modeLine =
        sourceMode === 'transcript'
            ? 'Source: transcript captions'
            : sourceMode === 'metadata'
                ? 'Source: title + metadata'
                : 'Source: minimal URL context';

    const fallbackPoints =
        selected.length > 0
            ? selected.map((line) => `- ${line}`)
            : [
                '- A precise transcript was not available in this run.',
                '- This fallback focuses on stable context so you still receive a usable summary output.',
                '- For higher fidelity, try a video with captions enabled and rerun once traffic drops.',
            ];

    const overview =
        selected.slice(0, 2).join(' ') ||
        (metadata?.description
            ? metadata.description
            : 'A best-effort summary was generated from limited available data.');

    const keywordsLine =
        terms.length > 0
            ? terms.join(', ')
            : 'No strong keyword signal detected from available text.';

    return [
        `> **Fallback Summary Mode:** ${reason}`,
        '',
        titleLine,
        titleLine ? '' : '',
        '## Overview',
        overview,
        '',
        '## Key Points',
        ...fallbackPoints,
        '',
        '## Topics & Stats',
        `- ${modeLine}`,
        `- Estimated covered runtime: ~${minutes} minute(s)`,
        `- Processed words: ${words.length}`,
        `- Detected topics: ${keywordsLine}`,
        `- Video link: ${videoUrl}`,
    ]
        .filter(Boolean)
        .join('\n');
}

async function callOpenRouter(modelName: string, systemPrompt: string, userPrompt: string) {
    return fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'AI Tools Hub',
        },
        body: JSON.stringify({
            model: modelName,
            temperature: 0.2,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        }),
    });
}

async function fetchVideoMetadata(videoId: string): Promise<{ title: string; description: string } | null> {
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const res = await fetch(oembedUrl);
        if (res.ok) {
            const data = (await res.json()) as { title?: string; author_name?: string };
            return {
                title: normalizeText(data.title || ''),
                description: data.author_name ? `Video by ${normalizeText(data.author_name)}` : '',
            };
        }
    } catch (err) {
        console.error('[YouTube Summarizer] Failed to fetch oEmbed metadata:', err);
    }

    try {
        const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const html = await watchRes.text();
        const titleMatch = html.match(/<title>(.+?)<\/title>/i);
        const descMatch = html.match(/<meta name="description" content="(.+?)"/i);
        return {
            title: titleMatch ? normalizeText(titleMatch[1].replace(' - YouTube', '')) : '',
            description: descMatch ? normalizeText(descMatch[1]) : '',
        };
    } catch (err) {
        console.error('[YouTube Summarizer] Failed to scrape metadata:', err);
    }

    return null;
}

function extractVideoId(url: string) {
    try {
        const parsedUrl = new URL(url);
        let videoId = '';
        if (parsedUrl.hostname.includes('youtube.com')) {
            videoId = parsedUrl.searchParams.get('v') || '';
        } else if (parsedUrl.hostname.includes('youtu.be')) {
            videoId = parsedUrl.pathname.slice(1);
        }

        if (videoId.includes('?')) {
            videoId = videoId.split('?')[0];
        }

        return normalizeText(videoId);
    } catch {
        return '';
    }
}

export async function POST(req: Request) {
    try {
        const { url } = (await req.json()) as { url?: string };

        if (!url || !url.trim()) {
            return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return NextResponse.json({ error: 'Invalid YouTube URL - could not extract Video ID' }, { status: 400 });
        }

        const canonicalVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        let sourceMode: SourceMode = 'transcript';
        let transcriptText = '';
        let transcriptSegments: TranscriptSegment[] = [];
        let metadata: { title: string; description: string } | null = null;

        try {
            const transcriptRaw = (await YoutubeTranscript.fetchTranscript(videoId)) as Array<{
                text?: string;
                offset?: number;
                duration?: number;
            }>;

            transcriptSegments = transcriptRaw
                .map((item) => ({
                    text: sanitizeTranscriptText(item.text || ''),
                    offset: Number.isFinite(item.offset) ? Number(item.offset) : 0,
                    duration: Number.isFinite(item.duration) ? Number(item.duration) : 0,
                }))
                .filter((item) => item.text.length > 0);

            transcriptText = normalizeText(transcriptSegments.map((item) => item.text).join(' '));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown transcript error';
            console.warn('[YouTube Summarizer] Transcript unavailable:', message);
        }

        if (!transcriptText) {
            metadata = await fetchVideoMetadata(videoId);
            if (metadata && (metadata.title || metadata.description)) {
                sourceMode = 'metadata';
                transcriptText = normalizeText(
                    `Video Title: ${metadata.title}. Video Description: ${metadata.description}.`
                );
            } else {
                sourceMode = 'minimal';
                transcriptText = normalizeText(
                    `Video ID: ${videoId}. Video URL: ${canonicalVideoUrl}. Captions and metadata were unavailable.`
                );
            }
        }

        if (sourceMode === 'transcript') {
            const words = transcriptText.split(/\s+/).filter(Boolean);
            if (words.length > MAX_TRANSCRIPT_WORDS) {
                transcriptText = words.slice(0, MAX_TRANSCRIPT_WORDS).join(' ');
            }
        }

        const systemPrompt =
            sourceMode === 'transcript'
                ? 'You summarize YouTube transcripts. Always reply in fluent English markdown with: Overview, Key Takeaways (bullets), and Actionable Insights. Keep it factual and concise.'
                : sourceMode === 'metadata'
                    ? 'You summarize videos from title/description only. Always reply in fluent English markdown with: Likely Overview, Likely Key Themes (bullets), and Notes. Clearly mark uncertainty and do not invent specific claims.'
                    : 'You produce a safe best-effort English markdown summary from minimal context. Provide: Overview, What We Can Infer, and Next Steps. Avoid hallucinations.';

        const userPrompt =
            sourceMode === 'transcript'
                ? `Transcript:\n${transcriptText}`
                : sourceMode === 'metadata'
                    ? `Metadata text:\n${transcriptText}\n\nVideo URL: ${canonicalVideoUrl}`
                    : `Minimal context:\n${transcriptText}\n\nVideo URL: ${canonicalVideoUrl}`;

        if (!OPENROUTER_API_KEY) {
            const summary = buildDeterministicSummary({
                sourceText: transcriptText,
                sourceMode,
                videoUrl: canonicalVideoUrl,
                segments: transcriptSegments,
                metadata,
                reason: 'OpenRouter key missing - local fallback used.',
            });
            return NextResponse.json({ summary });
        }

        let lastError = '';
        for (let round = 1; round <= MAX_RETRY_ROUNDS; round++) {
            console.log(`[YouTube Summarizer] Retry round ${round}/${MAX_RETRY_ROUNDS}`);
            for (const model of FREE_MODELS) {
                console.log('[YouTube Summarizer] Trying model:', model);
                try {
                    const response = await callOpenRouter(model, systemPrompt, userPrompt);

                    if (response.ok) {
                        const data = (await response.json()) as {
                            choices?: Array<{ message?: { content?: string } }>;
                        };
                        const summary = data.choices?.[0]?.message?.content;

                        if (!summary) {
                            lastError = `Empty response on ${model}`;
                        } else if (!isLikelyEnglish(summary)) {
                            console.log('[YouTube Summarizer] Non-English output, switching model');
                            lastError = `Non-English output on ${model}`;
                        } else if (isLowQualitySummary(summary)) {
                            console.log('[YouTube Summarizer] Low-quality output, switching model');
                            lastError = `Low-quality output on ${model}`;
                        } else {
                            return NextResponse.json({ summary });
                        }
                    } else if (response.status === 429) {
                        console.log('[YouTube Summarizer] Rate limited, switching model');
                        lastError = `429 rate limited on ${model}`;
                    } else {
                        const errorText = await response.text();
                        lastError = `${response.status} ${response.statusText} on ${model}: ${errorText.slice(0, 160)}`;
                    }
                } catch (err: unknown) {
                    lastError = err instanceof Error ? err.message : 'Unknown model call error';
                }

                await delay(RETRY_DELAY_MS);
            }
        }

        const summary = buildDeterministicSummary({
            sourceText: transcriptText,
            sourceMode,
            videoUrl: canonicalVideoUrl,
            segments: transcriptSegments,
            metadata,
            reason: `All AI models were busy or unusable (${lastError || 'unknown error'})`,
        });

        return NextResponse.json({ summary });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.error('[YouTube Summarizer] Unexpected error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

