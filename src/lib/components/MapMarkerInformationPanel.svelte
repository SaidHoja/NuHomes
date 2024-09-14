<script>
	export let selectedMapMarker = null;
	import ChatPanel from '$lib/components/ChatPanel.svelte';
	import { numberWithCommas } from '$lib/util/numformat';

	let messages = [];
</script>

<div class="h-full w-full flex flex-col justify-center text-balance text-stone-500 text-md">
	{#if selectedMapMarker != null}
		<h2 class="text-2xl self-start justify-self-start place-self-start">
			{selectedMapMarker?.RegionName}
		</h2>
		<p>New housing projects in the last 24 months: {numberWithCommas(selectedMapMarker?.Total)}</p>
		<p>Total population: {numberWithCommas(selectedMapMarker?.population)}</p>
		<ChatPanel city={selectedMapMarker?.RegionName} />
	{:else}
		<h2 class="text-2xl w-3/4 text-center mx-auto">Select a metro area for details</h2>
	{/if}
</div>
