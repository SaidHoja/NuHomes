<script>
	export let messages = [];
	export let selectedMapMarker = null;
	let currentTab = 'description';
	let currentMapMarker = selectedMapMarker;
	$: {
		if (selectedMapMarker != currentMapMarker) {
			currentMapMarker = selectedMapMarker;
			currentTab = 'description';
		}
		// currentTab = selectedMapMarker != currentMapMarker ? 'description' : currentTab;
	}
	export let prevRegionName = '';
	export let chatbotSummary = '';
	export let cachedAIResponses = {}; // regionname to ai response
	import ChatPanel from '$lib/components/ChatPanel.svelte';
	import AIChatThrobber from '$lib/components/AIChatThrobber.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { numberWithCommas } from '$lib/util/numformat';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	async function getCityDescription(regionName) {
		console.log('sending request');

		if (regionName in cachedAIResponses) {
			console.log('cached');
			return cachedAIResponses[regionName];
		}

		const response = await fetch('/api/chatbot', {
			method: 'POST',
			body: JSON.stringify({ regionName: regionName }),
			headers: {
				'content-type': 'application/json'
			}
		});
		prevRegionName = regionName;
		let summary = await response.json();
		summary = summary.message;
		chatbotSummary = summary;
		console.log(summary);
		cachedAIResponses[regionName] = summary;
		return summary;
	}

	async function getAdditionalData(regionName) {
		console.log(regionName);
		const response = await fetch(`/api/details/${regionName}`);
		let additionalData = await response.json();
		additionalData = additionalData.details;
		console.log(additionalData);
		return additionalData;
	}
	function cleanData(additionalData) {
		if (!additionalData) return {};
		const allowedFields = ['Total', 'Median household income', 'population', 'Median Sale Price'];
		let dict = {};
		for (let i of Object.entries(additionalData)) {
			console.log(i);
			if (allowedFields.includes(i[0])) {
				dict[i[0]] = i[1];
			}
		}
		console.log(dict);
		const order = ['Total', 'Median Sale Price', 'population', 'Median household income'];
		let newDict = {};
		for (let i of order) {
			if (i in dict) {
				if (i == 'Total') {
					newDict['Total New Developments'] = dict[i];
				} else if (i == 'population') {
					newDict['Population'] = dict[i];
				} else {
					newDict[i] = dict[i];
				}
			}
		}

		return newDict;
	}

	function cleanDataAlternative(data) {
		const fields = {
			Total: {
				dollars: false,
				prettyName: 'Total New Developments'
			},
			'Median household income': {
				dollars: true,
				prettyName: 'Median Household Income'
			},
			population: {
				dollars: false,
				prettyName: 'Population'
			},
			'Median Sale Price': {
				dollars: true,
				prettyName: 'Median Sale Price'
			}
		};

		let filtered = {};
		for (const key of Object.keys(data)) {
			if (key in fields) {
				filtered[fields[key].prettyName] = (fields[key].dollars ? '$' : '') + data[key];
			}
		}

		const order = [
			'Total New Developments',
			'Median Sale Price',
			'Population',
			'Median Household Income'
		];
		let newDict = {};
		for (let i of order) {
			if (i in filtered) {
				newDict[i] = filtered[i];
			}
		}

		return newDict;
	}
</script>

<div class="h-full w-full flex flex-col justify-center text-balance text-stone-500 text-md">
	{#if selectedMapMarker != null}
		<h2 class="text-2xl self-start justify-self-start place-self-start p-1">
			{selectedMapMarker?.RegionName}
		</h2>
		<Separator class="mb-2" />
		<Tabs.Root bind:value={currentTab} class="h-full w-full gap-0 flex flex-col">
			<Tabs.List class="grid w-full grid-cols-2 bg-stone-200 gap-1">
				<Tabs.Trigger
					value="description"
					class="data-[state=active]:bg-costar-orange data-[state=active]:text-white bg-background hover:bg-accent hover:text-accent-foreground"
					>Description</Tabs.Trigger
				>
				<Tabs.Trigger
					value="chatbot"
					class="data-[state=active]:bg-costar-orange data-[state=active]:text-white bg-background hover:bg-accent hover:text-accent-foreground"
					>Ask Nubert</Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content value="description" class="h-full">
				<h2 class="text-xl ml-2 mb-1">AI Summary</h2>
				<div class="bg-white rounded-md p-2 px-3 mb-4 text-lg">
					{#if prevRegionName == selectedMapMarker?.RegionName}
						{chatbotSummary}
					{:else}
						{#await getCityDescription(selectedMapMarker?.RegionName)}
							<AIChatThrobber />
							Loading AI summary of {selectedMapMarker?.RegionName}...
						{:then summary}
							{summary}
						{/await}
					{/if}
				</div>
				<h2 class="text-xl ml-2 mb-1 -mt-2">Location Statistics</h2>

				<p class="ml-3 text-lg">
					{#await getAdditionalData(selectedMapMarker?.RegionName)}
						Loading additional data...
					{:then additionalData}
						<Table.Root>
							<Table.Body>
								{#each Object.entries(cleanDataAlternative( { ...additionalData, ...selectedMapMarker } )) as [key, value]}
									<Table.Row>
										<Table.Cell>{key}</Table.Cell>
										<Table.Cell>{numberWithCommas(value)}</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					{:catch}
						Something went wrong!
					{/await}
				</p>
				<!-- {#if selectedMapMarker?.['Median household income']}{/if} -->
			</Tabs.Content>
			<Tabs.Content value="chatbot" class="flex-grow">
				<ChatPanel {messages} city={selectedMapMarker?.RegionName} />
			</Tabs.Content>
		</Tabs.Root>
	{:else}
		<h2 class="text-2xl w-3/4 text-center mx-auto">Select a metro area for details</h2>
	{/if}
</div>
