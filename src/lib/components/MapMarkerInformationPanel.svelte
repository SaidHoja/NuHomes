<script>
	export let selectedMapMarker = null;
</script>

<div class="flex items-center flex-col justify-center h-full w-full text-center text-balance">
	<h2 class="text-2xl text-stone-500 w-3/4">
		{selectedMapMarker ? selectedMapMarker?.RegionName : 'Select a metro area for details'}
	</h2>
	<!-- <div
		class="border-2 border-rose-500 flex items-center flex-col justify-center h-full w-full text-center text-balance"
	>
		<h2 class="text-2xl text-stone-500 w-3/4">WOW City info</h2>
	</div> -->
</div>
