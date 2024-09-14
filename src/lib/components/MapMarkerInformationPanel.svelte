<script>
	export let selectedMapMarker = null;
	import { numberWithCommas } from '$lib/util/numformat';
</script>

<div class="h-full w-full flex flex-col justify-center text-balance text-stone-500 text-md">
	{#if selectedMapMarker != null}
		<h2 class="text-2xl self-start justify-self-start place-self-start">
			{selectedMapMarker?.RegionName}
		</h2>
		<p>New housing projects in the last 24 months: {selectedMapMarker?.Total}</p>
		<p>Total population: {numberWithCommas(selectedMapMarker?.population)}</p>
	{:else}
		<h2 class="text-2xl w-3/4 text-center mx-auto">Select a metro area for details</h2>
	{/if}
	<!-- <div
		class="border-2 border-rose-500 flex items-center flex-col justify-center h-full w-full text-center text-balance"
	>
		<h2 class="text-2xl text-stone-500 w-3/4">WOW City info</h2>
	</div> -->
</div>
