<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import "../theme.postcss";
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import "@skeletonlabs/skeleton/styles/all.css";
	// Most of your app wide CSS should be put in this file
	import "../app.postcss";
	import { AppShell, Toast } from "@skeletonlabs/skeleton";
</script>

<AppShell>
	<svelte:fragment slot="header" />
	<Toast position="tr" />
	<slot />
</AppShell>
