<script>
	export let city = 'your favorite city';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import { buttonVariants } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import ArrowBigUpDash from '~icons/lucide/arrow-big-up-dash';
	let replyPending = false;
	let userInput = '';
	let messages = [
		{
			role: LLM_ID,
			content: `Hi, I'm Nubert! Ask me any question you might have about ${city}!`
		},
		{
			role: LLM_ID,
			content: `Hi, Nubert! It's great to meet you. Could you tell me more about ${city}?`
		},
		{
			role: USER_ID,
			content: `Definitely, here's some information about the wonderful destination of ${city}: (...)`
		}
	];

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

<div class="flex flex-col justify-end rounded-md h-full gap-2">
	<div class="flex flex-col px-4 grow overflow-y-scroll h-2 gap-2 justify-end">
		{#each messages.filter((a) => a.role != FIRST_ID) as message}
			<div
				class={`${message.role == USER_ID ? 'self-end' : 'self-start'} flex gap-2 max-w-[85%] w-auto`}
			>
				<div
					class={`${message.role == USER_ID ? 'order-3' : 'order-1'} w-8 h-8 rounded-lg bg-stone-700 text-white text-center self-end grid grid-rows-1`}
				>
					<p class="w-8 h-min my-auto">
						{message.role == LLM_ID ? 'AI' : 'ME'}
					</p>
				</div>
				<div class="order-2 bg-white p-2 px-3 rounded-md text-sm">
					{message.content}
				</div>
			</div>
		{/each}
	</div>
	<form
		method="POST"
		action="/chatbot?/query"
		class="flex w-full gap-2"
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
			class=""
			name="newMessage"
			bind:value={userInput}
		/>
		<input type="hidden" name="messages" value={JSON.stringify(messages)} />
		<Button size="icon" type="submit"><ArrowBigUpDash class="w-4 h-4" /></Button>
	</form>
</div>
