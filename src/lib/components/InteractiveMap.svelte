<script>
	export const ssr = false;
	import { onMount } from 'svelte';

	const datapoints = [
		[[38.848761293619916, 360 - 77.29737585786484], 20],
		[[37.54120534759968, 360 - 77.43625056309851], 10]
	];

	onMount(async () => {
		const L = await import('leaflet');
		// const map = L.map('map').setView([51.505, -0.09], 13);
		const map = L.map('map').setView([37.4316, 360 - 78.6569], 7);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		function onPointClick(e) {
			alert('Point was clicked at ' + e.latlng);
		}

		for (const point of datapoints) {
			// console.log('adding point', point);
			const circle = L.circle(point[0], {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.5,
				radius: point[1] * 5000
			}).addTo(map);

			circle.bindPopup('I am a popup!');
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
		height: 500px;
		border-radius: 1em;
	}
</style>
