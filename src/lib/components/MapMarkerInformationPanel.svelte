<script>
	export let selectedMapMarker = null;
	import ChatPanel from '$lib/components/ChatPanel.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { numberWithCommas } from '$lib/util/numformat';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
</script>

<div class="h-full w-full flex flex-col justify-center text-balance text-stone-500 text-md">
	{#if selectedMapMarker != null}
		<h2 class="text-2xl self-start justify-self-start place-self-start p-1">
			{selectedMapMarker?.RegionName}
		</h2>
		<Separator class="mb-2" />
		<Tabs.Root value="description" class="h-full w-full gap-2 flex flex-col">
			<Tabs.List class="grid w-full grid-cols-2 bg-stone-200 gap-1">
				<Tabs.Trigger
					value="description"
					class="data-[state=active]:bg-costar-orange data-[state=active]:text-white bg-background hover:bg-accent hover:text-accent-foreground"
					>Description</Tabs.Trigger
				>
				<Tabs.Trigger
					value="chatbot"
					class="data-[state=active]:bg-costar-orange data-[state=active]:text-white bg-background hover:bg-accent hover:text-accent-foreground"
					>Chat</Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content value="description" class="h-full">
				<p>
					New housing projects in the last 24 months: {numberWithCommas(selectedMapMarker?.Total)}
				</p>
				<p>Total population: {numberWithCommas(selectedMapMarker?.population)}</p>
			</Tabs.Content>
			<Tabs.Content value="chatbot" class="flex-grow">
				<ChatPanel city={selectedMapMarker?.RegionName} />
			</Tabs.Content>
		</Tabs.Root>
	{:else}
		<h2 class="text-2xl w-3/4 text-center mx-auto">Select a metro area for details</h2>
	{/if}
</div>
