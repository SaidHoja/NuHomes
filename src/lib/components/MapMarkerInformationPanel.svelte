<script>
	export let selectedMapMarker = null;
</script>

<div class="flex items-center flex-col justify-center h-full w-full">
	<h2 class="text-2xl text-stone-500">
		{selectedMapMarker
			? selectedMapMarker?.city + ', ' + selectedMapMarker?.state
			: 'Select a metro area for details'}
	</h2>
</div>
