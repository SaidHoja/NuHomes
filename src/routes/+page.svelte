<script>
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import Section from '$lib/components/Section.svelte';
	import MapMarkerInformationPanel from '$lib/components/MapMarkerInformationPanel.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Progress } from '$lib/components/ui/progress';
	import * as Resizable from '$lib/components/ui/resizable';
	export let data;

	// const datapoints = [
	// 	{
	// 		lat: 38.848761293619916,
	// 		long: 360 - 77.29737585786484,
	// 		size: 20,
	// 		city: 'Fairfax',
	// 		state: 'VA'
	// 	},
	// 	{
	// 		lat: 37.54120534759968,
	// 		long: 360 - 77.43625056309851,
	// 		size: 10,
	// 		city: 'Richmond',
	// 		state: 'VA'
	// 	}
	// ];

	// Fake loading bar and messages
	const funLoadingMessages = [
		'Taking pictures of your house',
		'Peering into your garage',
		'Computing shed square footage',
		'Funding your local HOA'
	];
	const getFunLoadingMessage = () => {
		return funLoadingMessages[Math.floor(Math.random() * funLoadingMessages.length)];
	};
	let funLoadingMessage = getFunLoadingMessage();
	let loadingProgress = 12;

	setInterval(() => {
		funLoadingMessage = getFunLoadingMessage();
	}, 3500);

	setInterval(() => {
		loadingProgress += Math.min(85 - loadingProgress, Math.random() * 3);
	}, 100);

	// TODO: Complete this in InteractiveMap.svelte
	// TODO: Complete event handler for resizer to refresh map (https://leafletjs.com/reference.html#map-methods-for-modifying-map-state)
	let selectedMapMarker = null;
	const setSelectedMapMarker = (marker) => {
		selectedMapMarker = marker;
	};
	const resizeEventTarget = new EventTarget();
	const resizeEvent = new Event('interactiveMapResized');
</script>

<!-- <NavigationBar />
<Separator /> -->
<Section>
	<Resizable.PaneGroup direction="horizontal">
		<Resizable.Pane defaultSize={65} minSize={20}>
			{#await data.NCData}
				<div class="w-full h-[550px] flex flex-col items-center justify-center gap-2">
					<h1>{funLoadingMessage}...</h1>
					<div class="w-2/5">
						<Progress value={loadingProgress} />
					</div>
				</div>
			{:then datapoints}
				<InteractiveMap {datapoints} {setSelectedMapMarker} {resizeEventTarget} />
			{:catch err}
				<div class="w-full h-[550px] flex flex-col items-center justify-center gap-1">
					<h1 class="text-lg">Something went wrong!</h1>
					<h2 class="text-stone-500">Please try again later.</h2>
				</div>
			{/await}
		</Resizable.Pane>
		<Resizable.Handle
			withHandle
			cb={() => {
				resizeEventTarget.dispatchEvent(resizeEvent);
			}}
		/>
		<Resizable.Pane defaultSize={35} minSize={20}>
			<div class="bg-stone-100 h-full rounded-md rounded-tl-none rounded-bl-none p-4">
				<MapMarkerInformationPanel {selectedMapMarker} />
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</Section>
<div class="h-8" />
