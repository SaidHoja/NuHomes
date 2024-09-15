<script>
	export let data;
	import { tweened } from 'svelte/motion';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';
	import Section from '$lib/components/Section.svelte';
	import MapMarkerInformationPanel from '$lib/components/MapMarkerInformationPanel.svelte';
	import ChatPanel from '$lib/components/ChatPanel.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import * as Resizable from '$lib/components/ui/resizable';

	// Chat panel messages
	let messages = [];

	// Loading bar and messages
	const LOADING_TWEEN_DURATION = 400;
	const funLoadingMessages = [
		'Taking pictures of your house',
		'Peering into your garage',
		'Funding your local HOA',
		'Begging CoStar for a job',
		'Drilling plot holes',
		'Doing nefarious things',
		"Hold on, I'm thinking",
		'Reprimanding Nubert for help'
		// 'Installing malware',
		// 'Scraping the dark web for your SSN',
		// 'Stealing your browser cookies'
	];
	const getFunLoadingMessage = () => {
		return funLoadingMessages[Math.floor(Math.random() * funLoadingMessages.length)];
	};
	let funLoadingMessage = getFunLoadingMessage();
	let loadingProgress = tweened(0.12, {
		duration: LOADING_TWEEN_DURATION,
		easing: cubicInOut
	});

	// FIXME: I think the interval is created here on the server and streamed to the client, but is being tried to remove on the client instead of the server, which keeps it loading forever...
	// Cycle loading message
	const loadingRepeatingInterval = setInterval(() => {
		funLoadingMessage = getFunLoadingMessage();
		const before = $loadingProgress;
		// const add = Math.random() * 0.1;
		const add = Math.random();
		loadingProgress.set(before + add);
		// console.log(before, $loadingProgress, add);
	}, 1600);

	// TODO: Review timing
	// Clientside promise wrapper for streamed data
	const loadingPromise = new Promise(async (res, rej) => {
		try {
			const dat = await data.NCData;
			setTimeout(
				() => {
					clearInterval(loadingRepeatingInterval);
					loadingProgress.set(1);
					setTimeout(() => {
						res(dat);
					}, LOADING_TWEEN_DURATION + 100);
				},
				2000 + Math.random() * 600
			);
		} catch (e) {
			rej(e);
		}
	});

	// Handlers and values for the currently-selected map marker
	let selectedMapMarker = null;
	const setSelectedMapMarker = (marker) => {
		messages = [];
		selectedMapMarker = marker;
	};
	const resizeEventTarget = new EventTarget();
	const resizeEvent = new Event('interactiveMapResized');
</script>

<Section class="-mt-32 min-h-[90vh]">
	<Resizable.PaneGroup direction="horizontal">
		<Resizable.Pane defaultSize={65} minSize={20}>
			{#await loadingPromise}
				<div class="w-full h-[90vh] flex flex-col items-center justify-center gap-2">
					<h1>{funLoadingMessage}...</h1>
					<div class="w-2/5">
						<Progress value={$loadingProgress * 100} />
					</div>
				</div>
			{:then datapoints}
				<InteractiveMap {datapoints} {setSelectedMapMarker} {resizeEventTarget} />
			{:catch err}
				<div class="w-full h-[90vh] flex flex-col items-center justify-center gap-1">
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
				<MapMarkerInformationPanel {messages} {selectedMapMarker} />
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</Section>

<div class="h-8" />
