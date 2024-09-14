<script>
	export const ssr = false;
	export let datapoints;
	export let setSelectedMapMarker;
	export let resizeEventTarget;
	import { onMount } from 'svelte';

	onMount(async () => {
		const L = await import('leaflet');
		const map = L.map('map').setView([37.4316, 360 - 78.6569], 7);

		// Add tile layers from openstreetmap (TODO: Review TOS for site)
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		// Set selected map marker for info panel when a map marker is clicked on
		function onPointClick(e) {
			setSelectedMapMarker(e.sourceTarget.options.sourceData);
		}

		// Invalidate our map when the map pane is resized bigger than before
		resizeEventTarget.addEventListener('interactiveMapResized', () => {
			console.log('map resized');
		});

		// Create a map marker for each of our points
		for (const point of datapoints) {
			const circle = L.circle([point.lat, point.long], {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.5,
				radius: point.size * 5000,
				sourceData: point
			}).addTo(map);

			circle.bindPopup(`${point.city}, ${point.state}<br />${point.size}`);
			circle.on('click', onPointClick);
		}
	});
</script>

<div id="map"></div>

<head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
</head>

<style>
	#map {
		height: 550px;
		/* border-radius: 1em 0 0 1em; */
		@apply rounded-md;
		@apply rounded-tr-none;
		@apply rounded-br-none;
	}
</style>
