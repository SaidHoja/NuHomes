<script>
	export let message;

	// TODO: Unify these variables somewhere/declare them globally
	const USER_ID = 'user';
	const LLM_ID = 'assistant';
	const FIRST_ID = 'system';
</script>

<div
	class={`${message.role == USER_ID ? 'self-end' : 'self-start'} flex gap-2 max-w-[85%] w-auto messages-container`}
>
	<div
		class={`${message.role == USER_ID ? 'order-3' : 'order-1'} w-8 h-8 rounded-lg bg-stone-700 text-white text-center self-end grid grid-rows-1`}
	>
		<p class="w-8 h-min my-auto">
			{message.role == LLM_ID ? 'AI' : 'ME'}
		</p>
	</div>
	<div class="order-2 bg-white p-2 px-3 rounded-md text-sm">
		<slot />
	</div>
</div>
