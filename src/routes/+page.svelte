<script>
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import Section from '$lib/components/Section.svelte';
	import { Separator } from '$lib/components/ui/separator';
</script>

<NavigationBar />
<Separator />
<Section>
	<InteractiveMap />
</Section>
