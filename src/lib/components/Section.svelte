<script>
	let className = '';
	export { className as class };
</script>

<div class={`m-8 mb-0 shadow-xl rounded-md bg-background ${className}`}>
	<slot />
</div>

<style>
	div {
		height: min-content;
		width: auto;
	}
</style>
