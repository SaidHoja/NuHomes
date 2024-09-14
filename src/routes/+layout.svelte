<script>
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import '../app.css';
</script>

<NavigationBar />
<Separator />

<div class="hero-section">
	<div class="hero-content">
	  <h1 class="homes-title">Find a home in a neighborhood you love.</h1>
	  <div id="vue-homepage-typeahead" class="typeahead-container"></div>
	</div>
  </div>
<style>

.hero-section {
	position: relative;
	background: url('/testImage.jpg') no-repeat center center;
	background-size: cover; /* Makes sure the image covers the entire container */
	height: 637px; /* Set the height of the section to match the aspect ratio of your image */
	display: flex;
	align-items: center; /* Vertically centers the content */
	justify-content: center; /* Horizontally centers the content */
	color: white; /* Text color, change as needed */
	text-align: center; /* Center text alignment */
  }
  
  .hero-content {
	position: relative;
	z-index: 1; /* Ensures text is above the background */
	background-color: rgba(0, 0, 0, 0.5); /* Optional: Semi-transparent background for better readability */
	padding: 20px; /* Optional: Add padding for spacing */
	border-radius: 8px; /* Optional: Rounded corners */
  }
  
  .homes-title {
	margin: 0; /* Remove default margins */
	font-size: 2rem; /* Adjust font size as needed */
	border: none; /* Remove border */
	background: transparent; 
  }
  
  .typeahead-container {
	margin-top: 20px; /* Space between title and typeahead container */
  }
</style>
<slot />


<head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
		rel="stylesheet"
	/>
</head>
