<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell slotSidebarLeft="w-42 bg-surface-500/10">
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>
	<div class="container p-10 mx-auto">
		<slot />
	</div>
</AppShell>
