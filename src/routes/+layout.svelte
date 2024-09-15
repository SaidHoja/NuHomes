<script>
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
</script>

<Toaster />
<NavigationBar />
<Separator />

<div class="hero-section -z-[1]">
	<div class="bg-transparent text-6xl mb-20">
		<h1 class="bg-transparent">
			Looking for a <span style="color:orange; font-weight: bold">Nu</span> place to live?
		</h1>
		<h2 class="text-2xl text-stone-200 mt-2">
			Dive deeper into where new construction is appearing!
		</h2>
		<div id="vue-homepage-typeahead" class="typeahead-container"></div>
	</div>
</div>
<slot />

<!-- TODO: Add footer with information -->

<head>
	<title>NuHomes</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
		rel="stylesheet"
	/>
</head>

<style>
	/* Originally 637px */
	.hero-section {
		position: relative;
		background: url('/testImage.jpg') no-repeat center center;
		background-size: cover; /* Makes sure the image covers the entire container */
		height: 420px; /* Set the height of the section to match the aspect ratio of your image */
		display: flex;
		align-items: center; /* Vertically centers the content */
		justify-content: center; /* Horizontally centers the content */
		color: white; /* Text color, change as needed */
		text-align: center; /* Center text alignment */
	}

	.typeahead-container {
		margin-top: 20px; /* Space between title and typeahead container */
	}
</style>
