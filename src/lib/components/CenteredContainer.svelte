<!-- TODO: Finish -->
<script>
	export let horizontal = true;
	export let vertical = false;
</script>

<div class={`${horizontal ? 'centered-horizontal' : ''} ${vertical ? 'centered-vertical' : ''}`}>
	<slot />
</div>

<style>
	.centered-horizontal {
		margin: auto;
	}
</style>
