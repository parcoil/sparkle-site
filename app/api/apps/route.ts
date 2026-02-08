const GITHUB_RAW_URL =
	'https://raw.githubusercontent.com/Parcoil/Sparkle/refs/heads/v2/src/renderer/src/assets/apps.json';

export async function GET() {
	console.log('Attempting to fetch apps from:', GITHUB_RAW_URL);

	try {
		const response = await fetch(GITHUB_RAW_URL, {
			headers: {
				'User-Agent': 'Sparkle-Site/1.0',
				Accept: 'application/json'
			}
		});

		console.log('Response status:', response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('GitHub API error response:', errorText);
			return Response.json(
				{ error: `GitHub API responded with status: ${response.status} - ${response.statusText}` },
				{ status: 500 }
			);
		}

		let data;
		try {
			data = await response.json();
			console.log('Successfully parsed JSON response');
		} catch (parseError) {
			console.error('Failed to parse JSON response:', parseError);
			return Response.json({ error: 'Failed to parse JSON response from GitHub' }, { status: 500 });
		}

		const appsArray = Array.isArray(data) ? data : data?.apps;

		if (!Array.isArray(appsArray)) {
			console.error('Unexpected data format:', data);
			return Response.json(
				{ error: 'Expected an array of apps or an object with an apps array' },
				{ status: 500 }
			);
		}

		console.log(`Successfully fetched ${appsArray.length} apps`);

		return Response.json(appsArray, {
			headers: {
				'Cache-Control': 'public, max-age=3600',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (error) {
		console.error('Error in GET /api/apps:', error);
		return Response.json(
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
