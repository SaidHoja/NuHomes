<script>
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import Section from '$lib/components/Section.svelte';
	import MapMarkerInformationPanel from '$lib/components/MapMarkerInformationPanel.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Resizable from '$lib/components/ui/resizable';

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

	// TODO: Complete this in InteractiveMap.svelte
	// TODO: Complete event handler for resizer to refresh map (https://leafletjs.com/reference.html#map-methods-for-modifying-map-state)
	let selectedMapMarker = null;
	const setSelectedMapMarker = (marker) => {
		selectedMapMarker = marker;
	};
	const resizeEventTarget = new EventTarget();
	const resizeEvent = new Event('interactiveMapResized');
</script>

<NavigationBar />
<Separator />
<Section>
	<Resizable.PaneGroup direction="horizontal">
		<Resizable.Pane defaultSize={65}>
			<InteractiveMap {datapoints} {setSelectedMapMarker} {resizeEventTarget} />
		</Resizable.Pane>
		<Resizable.Handle
			withHandle
			cb={() => {
				resizeEventTarget.dispatchEvent(resizeEvent);
			}}
		/>
		<Resizable.Pane>
			<div class="bg-stone-100 h-full rounded-md rounded-tl-none rounded-bl-none p-4">
				<MapMarkerInformationPanel {selectedMapMarker} />
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</Section>
<div class="h-8" />
