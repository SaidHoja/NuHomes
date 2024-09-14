<script>
	export const ssr = false;
	import { onMount } from 'svelte';
	onMount(async () => {
		const L = await import('leaflet');
		// const map = L.map('map').setView([51.505, -0.09], 13);
		const map = L.map('map').setView([37.4316, 360 - 78.6569], 7);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);
	});
</script>

<div id="map"></div>

<head>
	<!-- <script
		async
		src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=visualization&callback=initMap"
	></script> -->
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
	<!-- <script
		src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
		integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
		crossorigin=""
	></script> -->
</head>

<style>
	#map {
		height: 500px;
	}
</style>
