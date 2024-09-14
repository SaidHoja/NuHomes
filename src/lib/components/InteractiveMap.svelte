<script>
	export const ssr = false;
	import { onMount } from 'svelte';

	const datapoints = [
		{
			lat: 38.848761293619916,
			long: 360 - 77.29737585786484,
			size: 20,
			city: 'Fairfax',
			state: 'VA'
		},
		{
			lat: 37.54120534759968,
			long: 360 - 77.43625056309851,
			size: 10,
			city: 'Richmond',
			state: 'VA'
		}
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
			// alert('Point was clicked at ' + e.latlng);
		}

		for (const point of datapoints) {
			// console.log('adding point', point);
			const circle = L.circle([point.lat, point.long], {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.5,
				radius: point.size * 5000
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
		border-radius: 1em;
	}
</style>
