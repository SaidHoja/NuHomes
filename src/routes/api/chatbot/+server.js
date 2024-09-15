import { messagePPLX } from '$lib/util/llmUtils';

export const POST = async ({ request: req }) => {
	// Extract the `messages` from the body of the request

	let { regionName } = await req.json();
	//Request the OpenAI API for the response based on the prompt
	let messages = [{ role: 'user', content: 'Give me a 50 word summary about ' + regionName }];
	let summary = await messagePPLX(messages, 0.0);

	return new Response(JSON.stringify({ status: 200, message: summary }));
};
