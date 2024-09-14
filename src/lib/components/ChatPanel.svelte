<script>
	export let city = 'your favorite city';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import ArrowBigUpDash from '~icons/lucide/arrow-big-up-dash';
	let replyPending = false;
	let userInput = '';
	let messages = [];

	const USER_ID = 'user';
	const LLM_ID = 'assistant';
	const FIRST_ID = 'system';

	// NOTE: Add first placeholder message from AI

	const submitMessage = (event) => {
		// console.log(event);
		console.log(userInput);
		messages = [...messages, { role: 'user', content: userInput }];
		userInput = '';
		replyPending = true;
	};

	const customEnhanced = ({ formElement, formData, action, cancel, submitter }) => {
		// console.log(formData.keys())
		const existingMessages = JSON.parse(formData.get('messages'));
		const newMessage = formData.get('newMessage');
		userInput = '';

		messages = [...existingMessages, { role: USER_ID, content: newMessage, confirmed: false }];

		return async ({ result, update }) => {
			console.log('form result:', result);
			if (result.status == 200) {
				if (result.data.success) {
					messages[messages.length - 1].confirmed = true;
					messages = [...messages, { role: LLM_ID, content: result.data.reply, confirmed: true }];
					return;
				}
			}

			userInput = messages[messages.length - 1].content;
			messages.pop();
			console.log('error', result);
			toast('Send error', {
				description:
					'It looks like an error occured while sending your message. Please try again later.'
			});
		};
	};
</script>

<!-- TODO: Add Scroll Area component -->
<div class="rounded-md p-4 max-w-sm">
	<div class="flex flex-col p-4">
		{#each messages.filter((a) => a.role != FIRST_ID) as message}
			<div
				class={`${message.role == USER_ID ? 'self-end' : 'self-start'} flex gap-2 overflow-hidden`}
			>
				<div
					class={`${message.role == USER_ID ? 'order-3' : 'order-1'} w-8 h-8 rounded-full bg-stone-700 text-white text-center`}
				>
					<p class="my-auto h-min">{message.role == LLM_ID ? 'AI' : 'ME'}</p>
				</div>
				<div class="order-2">
					{message.content}
				</div>
			</div>
		{/each}
	</div>
	<form
		method="POST"
		action="/chatbot?/query"
		class="flex w-fullitems-center space-x-2"
		use:enhance={customEnhanced}
	>
		<!-- <form
		method="POST"
		action="/api/chatbot"
		class="flex w-fullitems-center space-x-2"
		on:submit|preventDefault={submitMessage}
	> -->
		<Input
			type="text"
			placeholder={`Ask a question about ${city}...`}
			class="max-w-xs"
			name="newMessage"
			bind:value={userInput}
		/>
		<input type="hidden" name="messages" value={JSON.stringify(messages)} />
		<Button size="icon" type="submit"><ArrowBigUpDash class="w-4 h-4" /></Button>
	</form>
</div>
