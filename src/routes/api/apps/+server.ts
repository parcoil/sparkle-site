import { json } from '@sveltejs/kit';

export async function GET() {
    const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Parcoil/Sparkle/refs/heads/v2/src/renderer/src/assets/apps.json';
    
    console.log('Attempting to fetch apps from:', GITHUB_RAW_URL);
    
    try {
        const response = await fetch(GITHUB_RAW_URL, {
            headers: {
                'User-Agent': 'Sparkle-Site/1.0',
                'Accept': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API error response:', errorText);
            throw new Error(`GitHub API responded with status: ${response.status} - ${response.statusText}`);
        }

        let data;
        try {
            data = await response.json();
            console.log('Successfully parsed JSON response');
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            throw new Error('Failed to parse JSON response from GitHub');
        }
        
        const appsArray = Array.isArray(data) ? data : data?.apps;
        
        if (!Array.isArray(appsArray)) {
            console.error('Unexpected data format:', data);
            throw new Error('Expected an array of apps or an object with an apps array');
        }

        console.log(`Successfully fetched ${appsArray.length} apps`);
        
        return json(appsArray, {
            headers: {
                'Cache-Control': 'public, max-age=3600',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('Error in GET /api/apps:', error);
        return json(
            { 
                error: 'Failed to fetch apps',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
    }
}
