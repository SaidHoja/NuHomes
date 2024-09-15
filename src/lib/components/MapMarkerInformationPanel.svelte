<script>
	export let messages = [];
	export let selectedMapMarker = null;
	let currentTab = 'description';
	let currentMapMarker = selectedMapMarker;
	$: {
		if (selectedMapMarker != currentMapMarker) {
			currentMapMarker = selectedMapMarker;
			currentTab = 'description';
		}
		// currentTab = selectedMapMarker != currentMapMarker ? 'description' : currentTab;
	}
	export let prevRegionName = '';
	export let chatbotSummary = '';
	import ChatPanel from '$lib/components/ChatPanel.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { numberWithCommas } from '$lib/util/numformat';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	async function getCityDescription(regionName) {
		console.log('sending request');
		const response = await fetch('/api/chatbot', {
			method: 'POST',
			body: JSON.stringify({ regionName: regionName }),
			headers: {
				'content-type': 'application/json'
			}
		});
		prevRegionName = regionName;
		let summary = await response.json();
		summary = summary.message;
		chatbotSummary = summary;
		console.log(summary);
		return summary;
	}
</script>

<div class="h-full w-full flex flex-col justify-center text-balance text-stone-500 text-md">
	{#if selectedMapMarker != null}
		<h2 class="text-2xl self-start justify-self-start place-self-start p-1">
			{selectedMapMarker?.RegionName}
		</h2>
		<Separator class="mb-2" />
		<Tabs.Root bind:value={currentTab} class="h-full w-full gap-2 flex flex-col">
			<Tabs.List class="grid w-full grid-cols-2 bg-stone-200 gap-1">
				<Tabs.Trigger
					value="description"
					class="data-[state=active]:bg-costar-orange data-[state=active]:text-white bg-background hover:bg-accent hover:text-accent-foreground"
					>Description</Tabs.Trigger
				>
				<Tabs.Trigger
					value="chatbot"
					class="data-[state=active]:bg-costar-orange data-[state=active]:text-white bg-background hover:bg-accent hover:text-accent-foreground"
					>Ask Nubert</Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content value="description" class="h-full">
				<p>
					{#if prevRegionName == selectedMapMarker?.RegionName}
						{chatbotSummary}
					{:else}
						{#await getCityDescription(selectedMapMarker?.RegionName)}
							Loading...
						{:then summary}
							{summary}
						{/await}
					{/if}
					<br />
					<br />
				</p>
				<p>
					New housing projects in the last 24 months: {numberWithCommas(selectedMapMarker?.Total)}
				</p>
				<p>Total population: {numberWithCommas(selectedMapMarker?.population)}</p>
			</Tabs.Content>
			<Tabs.Content value="chatbot" class="flex-grow">
				<ChatPanel {messages} city={selectedMapMarker?.RegionName} />
			</Tabs.Content>
		</Tabs.Root>
	{:else}
		<h2 class="text-2xl w-3/4 text-center mx-auto">Select a metro area for details</h2>
	{/if}
</div>
