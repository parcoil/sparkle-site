
export const GET = async () => {
	const url = 'https://raw.githubusercontent.com/Parcoil/Sparkle/v2/get.ps1';
	const res = await fetch(url);
	if (!res.ok) return new Response('File not found', { status: 404 });
    // all of this junk just to get ascii and emojis to work :(
	const text = await res.text();
	const encoder = new TextEncoder(); // UTF-8
	const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM
	const encoded = encoder.encode(text);

	// Prepend BOM
	const fileData = new Uint8Array(bom.length + encoded.length);
	fileData.set(bom, 0);
	fileData.set(encoded, bom.length);

	return new Response(fileData, {
		headers: {
			'Content-Type': 'text/plain; charset=UTF-8',
			'Content-Disposition': 'attachment; filename="get.ps1"'
		}
	});
};
