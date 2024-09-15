<script>
	export const ssr = false;
	export let datapoints;
	export let setSelectedMapMarker;
	export let resizeEventTarget;
	import { onMount } from 'svelte';
	import { interpolate } from '$lib/util/colors';
	import { CircleCheck } from 'lucide-svelte';

	const isValidPoint = (point) => {
		return point && point.lat && point.lng && point.Total;
	};

	// Tracker for clicks, so we don't bring the user away from their selection
	let hasMapBeenClicked = false;

	// TODO: Add buttons for returning to global view and current location

	onMount(async () => {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};

		const L = await import('leaflet');
		const map = L.map('map').setView([37.4316, -78.6569], 7);

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				// Add pin for current location
				const currentLocation = L.marker([pos.coords.latitude, pos.coords.longitude], {
					title: 'Current location'
				}).addTo(map);
				if (!hasMapBeenClicked) {
					map.setView([pos.coords.latitude, pos.coords.longitude], 9);
				}
			},
			(error) => {
				console.log(error);
			},
			options
		);
		// console.log(datapoints[0]);

		// Add tile layers from openstreetmap (TODO: Review TOS for site)
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		// Invalidate our map when the map pane is resized bigger than before
		resizeEventTarget.addEventListener('interactiveMapResized', () => {
			map.invalidateSize();
		});

		let maxTotal = 0;
		let minTotal = Infinity;

		// Set selected map marker for info panel when a map marker is clicked on
		function onPointClick(e) {
			// TODO: Tweak this to see more of the bounds later
			let point = e?.sourceTarget;
			if (point) {
				map.flyToBounds(point.getBounds());
				setSelectedMapMarker(point?.options?.sourceData);
			}
			hasMapBeenClicked = true;
		}

		for (const point of datapoints) {
			if (isValidPoint(point)) {
				maxTotal = Math.max(maxTotal, point.Total);
				minTotal = Math.min(minTotal, point.Total);
			}
		}

		// Create a map marker for each of our points
		for (const point of datapoints) {
			if (isValidPoint(point)) {
				const fillColor = interpolate(
					'#3217e3',
					'#ff850f',
					(point.Total - minTotal) / (maxTotal - minTotal)
				);
				const circle = L.circle([point.lat, point.lng], {
					color: 'red',
					fillColor,
					fillOpacity: 0.75,
					radius: Math.max(12000, point.Total * 3),
					opacity: 0,
					weight: 0,
					color: fillColor,
					sourceData: point
				}).addTo(map);

				// circle.bindPopup(`${point.RegionName}<br />${point.size}`);
				circle.on('click', onPointClick);
			} else {
				console.log('Point does not contain expected value(s):', point);
				continue;
			}
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
		@apply rounded-md;
		@apply rounded-tr-none;
		@apply rounded-br-none;
	}
</style>
