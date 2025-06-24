// Simple SSE stream pushing random price every second
// Small changes made to avoid ResponseAborted error on client refresh.
// (prevents memory leaks and unnecessary CPU usage as timeouts keep running)
export async function GET(request: Request) {
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	let price = 100;
	let timeoutId: NodeJS.Timeout;
	let isConnected = true;

	const push = async () => {
		if (!isConnected) return;

		try {
			price += Math.random() - 0.5;
			await writer.write(`data: ${JSON.stringify({ price })}\n\n`);
			timeoutId = setTimeout(push, 1000);
		} catch (error) {
			console.error('Client disconnected');
			isConnected = false;
			if (timeoutId) clearTimeout(timeoutId);
		}
	};

	// Handle client disconnect
	request.signal.addEventListener('abort', () => {
		console.log('Client aborted connection');
		isConnected = false;
		if (timeoutId) clearTimeout(timeoutId);
		// Ignore close errors
		writer.close().catch(() => {});
	});

	push();

	// Simulate an error
	// return new Response('Simulated error', {
	// 	status: 500,
	// 	headers: {
	// 		'Content-Type': 'text/plain',
	// 	},
	// });

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		},
	});
}
