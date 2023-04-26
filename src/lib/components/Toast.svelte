<script lang="ts">
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	export let message: string;
	export let background:
		| 'variant-filled-error'
		| 'variant-filled-success'
		| 'variant-filled-warning'
		| 'variant-filled-primary'
		| string;
	const t: ToastSettings = {
		message: message,
		background: background,
		timeout: 2500
	};

	toastStore.trigger(t);
</script>
