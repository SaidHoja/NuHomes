import { PPLX_KEY } from '$env/static/private';
import { messagePPLX } from '$lib/util/llmUtils';

export const POST = async ({ request: req }) => {
	// Extract the `messages` from the body of the request

	let { messages } = await req.json();
	console.log(messages);
	//Request the OpenAI API for the response based on the prompt
  messages = [{ role: 'user', content: 'Tell me about fairfax, va' }];
  let x = await messagePPLX(messages).json();
  console.log("this is the message" , x)

  return new Response(JSON.stringify({ status: 200}, {message : x}))
	
};
