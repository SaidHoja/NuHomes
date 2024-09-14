import OpenAI from 'openai';
import { PPLX_KEY } from '$env/static/private';

const perplexity = new OpenAI({ apiKey: PPLX_KEY });

export const POST = async ({ request: req }) => {
	// Extract the `messages` from the body of the request

	const { messages } = await req.json();
  console.log(messages)
  //Request the OpenAI API for the response based on the prompt
	const options = {
		method: 'POST',
		headers: { Authorization: 'Bearer ' + PPLX_KEY, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			model: 'llama-3.1-sonar-small-128k-online',
			messages: [{ role: 'system', content: 'Be precise and concise.' }].concat(messages),
			max_tokens: '500',
			temperature: 0.2,
			top_p: 0.9,
			return_citations: true,
			search_domain_filter: ['perplexity.ai'],
			return_images: false,
			return_related_questions: false,
			search_recency_filter: 'month',
			top_k: 0,
			stream: false,
			presence_penalty: 0,
			frequency_penalty: 1
		})
	};
	let response = (await fetch('https://api.perplexity.ai/chat/completions', options)).json();
	response = await response;
	let llmRes = response.choices[0].message.content;
	return new Response(JSON.stringify({ message: llmRes}, { status: 200 }));
};
