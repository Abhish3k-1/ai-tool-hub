import { NextResponse } from 'next/server';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query || query.trim() === '') {
            return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
        }

        if (!FIRECRAWL_API_KEY) {
            return NextResponse.json({ error: 'Server configuration error: Firecrawl API key is missing.' }, { status: 500 });
        }

        // Use the REST API of Firecrawl directly to search the web
        // Asking it to look for job boards
        const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `${query}`,
                limit: 10
            })
        });

        if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            console.error('[Job Search] Firecrawl Error:', searchResponse.status, errorText);
            
            if (searchResponse.status === 402 || searchResponse.status === 403 || errorText.includes('credit')) {
                return NextResponse.json({ error: 'Firecrawl API credit limit reached or unauthorized.' }, { status: searchResponse.status });
            }
            
            return NextResponse.json({ error: `Failed to fetch jobs connected to Firecrawl (${searchResponse.status})` }, { status: searchResponse.status });
        }

        const data = await searchResponse.json();

        if (!data.success || !data.data || data.data.length === 0) {
            return NextResponse.json({ jobs: [] }); // No jobs found
        }

        // Map Firecrawl results into our expected schema
        const jobs = data.data.map((result: any) => ({
            title: result.title || 'Unknown Position',
            url: result.url || '#',
            description: result.description || 'No description provided.',
        }));

        return NextResponse.json({ jobs });

    } catch (error: any) {
        console.error('[Job Search] Unexpected error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
