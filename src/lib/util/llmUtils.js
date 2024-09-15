import { PPLX_KEY } from '$env/static/private';


// Message LLM with message array and returns llm's response. 
// Not responsible for maintaing the state of the conversation.
// Just sets initial system prompt
export async function messagePPLX(messages, temperature = 0.2, initialPrompt = [{ role: 'system', content: 'Be precise and concise.' }]){
    const options = {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + PPLX_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: initialPrompt.concat(messages),
        temperature: temperature,
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
    return llmRes;
  }

  export default {messagePPLX};