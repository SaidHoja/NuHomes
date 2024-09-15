<script>
	export let city = 'your favorite city';
	export let messages = [];
	import { enhance } from '$app/forms';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import AIChatThrobber from '$lib/components/AIChatThrobber.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import { buttonVariants } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import ArrowBigUpDash from '~icons/lucide/arrow-big-up-dash';
	let replyPending = false;
	let userInput = '';
	let placeholderFirstMessage;
	$: {
		placeholderFirstMessage = {
			role: LLM_ID,
			content: `Hi, I'm Nubert! Ask me any question you might have about ${city}!`
		};
	}
	// attribution: https://dev.to/casualwriter/a-simple-markdown-parser-in-50-lines-of-js-4gpi
	function simpleMarkdown(mdText) {
		// first, handle syntax for code-block
		mdText = mdText.replace(/\r\n/g, '\n');
		mdText = mdText.replace(
			/\n~~~ *(.*?)\n([\s\S]*?)\n~~~/g,
			'<pre><code title="$1">$2</code></pre>'
		);
		mdText = mdText.replace(
			/\n``` *(.*?)\n([\s\S]*?)\n```/g,
			'<pre><code title="$1">$2</code></pre>'
		);

		// split by "pre>", skip for code-block and process normal text
		var mdHTML = '';
		var mdCode = mdText.split('pre>');

		for (var i = 0; i < mdCode.length; i++) {
			if (mdCode[i].substr(-2) == '</') {
				mdHTML += '<pre>' + mdCode[i] + 'pre>';
			} else {
				mdHTML += mdCode[i]
					.replace(/(.*)<$/, '$1')
					.replace(/^##### (.*?)\s*#*$/gm, '<h5>$1</h5>')
					.replace(/^#### (.*?)\s*#*$/gm, '<h4 id="$1">$1</h4>')
					.replace(/^### (.*?)\s*#*$/gm, '<h3 id="$1">$1</h3>')
					.replace(/^## (.*?)\s*#*$/gm, '<h2 id="$1">$1</h2>')
					.replace(/^# (.*?)\s*#*$/gm, '<h1 id="$1">$1</h1>')
					.replace(/^-{3,}|^\_{3,}|^\*{3,}/gm, '<hr/>')
					.replace(/``(.*?)``/gm, '<code>$1</code>')
					.replace(/`(.*?)`/gm, '<code>$1</code>')
					.replace(/^\>> (.*$)/gm, '<blockquote><blockquote>$1</blockquote></blockquote>')
					.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
					.replace(/<\/blockquote\>\n<blockquote\>/g, '\n<br>')
					.replace(/<\/blockquote\>\n<br\><blockquote\>/g, '\n<br>')
					.replace(/!\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<img alt="$1" src="$2" $3 />')
					.replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" />')
					.replace(/\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<a href="$2" title="$3">$1</a>')
					.replace(/<http(.*?)\>/gm, '<a href="http$1">http$1</a>')
					.replace(/\[(.*?)\]\(\)/gm, '<a href="$1">$1</a>')
					.replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
					.replace(/^[\*|+|-][ |.](.*)/gm, '<ul><li>$1</li></ul>')
					.replace(/<\/ul\>\n<ul\>/g, '\n')
					.replace(/^\d[ |.](.*)/gm, '<ol><li>$1</li></ol>')
					.replace(/<\/ol\>\n<ol\>/g, '\n')
					.replace(/\*\*\*(.*)\*\*\*/gm, '<b><em>$1</em></b>')
					.replace(/\*\*(.*)\*\*/gm, '<b>$1</b>')
					.replace(/\*([\w \d]*)\*/gm, '<em>$1</em>')
					.replace(/___(.*)___/gm, '<b><em>$1</em></b>')
					.replace(/__(.*)__/gm, '<u>$1</u>')
					.replace(/_([\w \d]*)_/gm, '<em>$1</em>')
					.replace(/~~(.*)~~/gm, '<del>$1</del>')
					.replace(/\^\^(.*)\^\^/gm, '<ins>$1</ins>')
					.replace(/ +\n/g, '\n<br/>')
					.replace(/\n\s*\n/g, '\n<p>\n')
					.replace(/^ {4,10}(.*)/gm, '<pre><code>$1</code></pre>')
					.replace(/^\t(.*)/gm, '<pre><code>$1</code></pre>')
					.replace(/<\/code\><\/pre\>\n<pre\><code\>/g, '\n')
					.replace(/\\([`_\\\*\+\-\.\(\)\[\]\{\}])/gm, '$1');
			}
		}

		return mdHTML.trim();
	}
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
		let newMessage = formData.get('newMessage');
		newMessage = simpleMarkdown(newMessage);
		console.log(newMessage);
		userInput = '';
		replyPending = true;

		messages = [...existingMessages, { role: USER_ID, content: newMessage, confirmed: false }];

		return async ({ result, update }) => {
			console.log('form result:', result);
			replyPending = false;
			if (result.status == 200) {
				if (result.data.success) {
					messages[messages.length - 1].confirmed = true;
					messages = [...messages, { role: LLM_ID, content: simpleMarkdown(result.data.reply), confirmed: true }];
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
	<div class="flex flex-col-reverse px-4 grow overflow-y-scroll h-2 gap-2">
		{#if replyPending}
			<ChatMessage message={{ role: LLM_ID }}><AIChatThrobber /></ChatMessage>
		{/if}
		{#each messages
			.filter((a) => a.role != FIRST_ID)
			.reverse()
			.concat([placeholderFirstMessage]) as message}
			{#if message.role === LLM_ID}
				<ChatMessage {message}>{@html message.content}</ChatMessage>
			{:else}
				<ChatMessage {message}>{message.content}</ChatMessage>
			{/if}
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
			name="newMessage"
			bind:value={userInput}
		/>
		<input type="hidden" name="messages" value={JSON.stringify(messages)} />
		<input type="hidden" name="location" value={city} />
		<Button size="icon" type="submit"><ArrowBigUpDash class="w-4 h-4" /></Button>
	</form>
</div>

<style>
	.messages-container:last-child {
		@apply mt-auto;
	}
</style>
