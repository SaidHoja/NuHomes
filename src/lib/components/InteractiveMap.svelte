<script>
	export const ssr = false;
	export let datapoints;
	export let setSelectedMapMarker;
	export let resizeEventTarget;
	import { onMount } from 'svelte';
	import { interpolate } from '$lib/util/colors';
	import { CircleCheck } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Input } from '$lib/components/ui/input/index.js';
	import Earth from '~icons/lucide/earth';
	import ZoomIn from '~icons/lucide/zoom-in';
	import ZoomOut from '~icons/lucide/zoom-out';
	import MapPin from '~icons/lucide/map-pin';
	import Search from '~icons/lucide/search';

	const isValidPoint = (point) => {
		return point && point.lat && point.lng && point.Total;
	};

	// Tracker for clicks, so we don't bring the user away from their selection
	let hasMapBeenClicked = false;

	// Tracker for whether geolocation has been permitted by the user
	let geolocationAllowed = false;

	// Bound value for search input
	let userSearchInput = '';

	// View of the US
	const VIEW_US = [[38.52855810387187, -97.21010471523788], 4];
	let VIEW_CUR_GEO;
	let map;

	// Search bar utilities
	let searchResults;
	$: searchResults = datapoints
		.filter((a) => a.RegionName.toLocaleLowerCase().includes(userSearchInput.toLocaleLowerCase()))
		.slice(0, 2);
	let searchResultsCursor = 0;
	let searchFocused = false;
	let searchMouseEntered = false;

	const selectMapMarker = (mkr) => {
		userSearchInput = mkr.RegionName;
		map.flyToBounds(mkr.circle);
		setSelectedMapMarker(mkr);
		searchFocused = false;
		searchResultsCursor = 0;
	};

	onMount(async () => {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};

		const L = await import('leaflet');
		map = L.map('map', {
			zoomControl: false,
			worldCopyJump: true,
			minZoom: 4
		}).setView(...VIEW_US);

		// Get current position, add a marker, and pan to it
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				// Add pin for current location
				VIEW_CUR_GEO = [[pos.coords.latitude, pos.coords.longitude], 9];
				const currentLocation = L.marker([pos.coords.latitude, pos.coords.longitude], {
					title: 'Current location'
				}).addTo(map);
				if (!hasMapBeenClicked) {
					// map.setView(...VIEW_CUR_GEO);
				}
				geolocationAllowed = true;
			},
			(error) => {
				console.log(error);
			},
			options
		);

		// Add tile layers from openstreetmap (TODO: Review TOS for site)
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		// Invalidate our map when the map pane is resized bigger than before
		resizeEventTarget.addEventListener('interactiveMapResized', () => {
			map.invalidateSize();
		});

		// Set selected map marker for info panel when a map marker is clicked on
		function onPointClick(e) {
			// TODO: Tweak this to see more of the bounds later
			let point = e?.sourceTarget;
			if (point) {
				// map.flyToBounds(point.getBounds());
				// setSelectedMapMarker(point?.options?.sourceData);
				selectMapMarker(point?.options?.sourceData);
			}
			hasMapBeenClicked = true;
		}

		// Calculate maximums and minimums for relative coloring
		let maxTotal = 0;
		let minTotal = Infinity;
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
					'#ffffff',
					'#ff850f',
					(point.Total - minTotal) / (maxTotal - minTotal)
				);
				const circle = L.circle([point.lat, point.lng], {
					color: 'red',
					fillColor,
					fillOpacity: 0.75,
					radius: Math.max(12000, point.Total * 3),
					opacity: 0.7,
					weight: 1,
					color: '#000000',
					sourceData: point
				}).addTo(map);

				point.circle = circle;

				// circle.bindPopup(`${point.RegionName}<br />${point.size}`);
				circle.on('click', onPointClick);
			} else {
				console.log('Point does not contain expected value(s):', point);
				continue;
			}
		}

		// Add a button to jump to global view
		// const globalButton = L.DivOverlay({ interactive: true, content: <p>Test</p> }).addTo(map);
	});
</script>

<div id="map">
	<div class="absolute z-[401] w-3/4 p-4 h-12 ml-[12.5%] flex flex-col">
		<div
			class={`bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-auto w-full text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-row ${searchResults.length > 0 && userSearchInput.length > 0 && searchFocused ? 'rounded-t-lg' : 'rounded-lg'}`}
		>
			<Input
				type="text"
				placeholder={`Search for your next favorite city...`}
				name="searchQuery"
				class={`rounded-full bg-transparent flex-shrink outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 ${searchResults.length > 0 ? 'rounded-br-0 rounded-bl-0' : ''}`}
				bind:value={userSearchInput}
				on:keydown={(e) => {
					// console.log(e);
					if (searchResults.length > 0) {
						if (e.key === 'Enter') {
							selectMapMarker(searchResults[searchResultsCursor]);
						} else if (e.key === 'Tab') {
							e.preventDefault();
							if (searchResults.length > 1) {
								searchResultsCursor += 1;
								searchResultsCursor %= 2;
							}
						} else {
							searchFocused = true;
						}
					}
				}}
				on:focus={(e) => {
					console.log('focus');
					searchFocused = true;
				}}
				on:blur={(e) => {
					console.log('blur');
					searchFocused = false;
				}}
			/><button class="p-2 pr-4 absolute right-4 top-5"
				><Search class="text-costar-orange w-4 h-4" /></button
			>
		</div>
		<div
			class="bg-white rounded-b-lg border-input"
			on:mouseenter={() => {
				searchMouseEntered = true;
			}}
			on:mouseleave={() => {
				searchMouseEntered = false;
			}}
		>
			{#if userSearchInput.length > 0 && searchFocused}
				{#each searchResults as result, i}
					<button
						class={`text-sm p-2 transition-all hover:bg-gray-100 ${i == 2 || searchResults.length == 1 ? 'rounded-b-lg' : ''} w-full text-left pl-3 ${i == searchResultsCursor && !searchMouseEntered ? 'bg-gray-100' : ''}`}
						on:click={() => {
							// userSearchInput = result.RegionName;
							// map.flyToBounds(result.circle);
							// setSelectedMapMarker(result);
							// searchFocused = false;
							selectMapMarker(result);
						}}>{result.RegionName}</button
					>
				{/each}
			{/if}
		</div>
	</div>
	<div class="absolute z-[401] bottom-4 left-4">
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					on:click={(e) => {
						// event.preventDefault();
						// console.log(e.stopPropagation);
						e.stopPropagation();
						map && map.zoomOut(1);
					}}
					size="icon"
					variant="secondary"
					class="shadow-md"><ZoomOut /></Button
				></Tooltip.Trigger
			>
			<Tooltip.Content>
				<p>Zoom out</p>
			</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					on:click={() => {
						map && map.flyTo(...VIEW_US);
					}}
					size="icon"
					variant="secondary"
					class="shadow-md"><Earth /></Button
				></Tooltip.Trigger
			>
			<Tooltip.Content>
				<p>Return to US view</p>
			</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					disabled={!geolocationAllowed}
					on:click={() => {
						map && VIEW_CUR_GEO && map.flyTo(...VIEW_CUR_GEO);
					}}
					size="icon"
					variant="secondary"
					class="shadow-md"><MapPin /></Button
				></Tooltip.Trigger
			>
			<Tooltip.Content>
				<p>{geolocationAllowed ? 'Jump to current location' : 'Location permission denied'}</p>
			</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					on:click={() => {
						map && map.zoomIn(1);
					}}
					size="icon"
					variant="secondary"
					class="shadow-md"><ZoomIn /></Button
				></Tooltip.Trigger
			>
			<Tooltip.Content>
				<p>Zoom in</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>

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
		/* height: 550px; */
		height: 90vh;
		@apply rounded-md;
		@apply rounded-tr-none;
		@apply rounded-br-none;
		@apply bg-background;
		@apply z-[2];
	}
</style>
