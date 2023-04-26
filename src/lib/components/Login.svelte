<script lang="ts">
	import { enhance } from '$app/forms';
	import Toast from './Toast.svelte';

	export let form: { message?: string };
</script>

<div class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
	<form
		use:enhance
		method="post"
		class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
	>
		<div class="inline-grid gird-cols-1 gap-1">
			<div class="p-2">
				<input type="text" name="username" class="input" placeholder="Kasutajanimi" required />
			</div>
			<div class="p-2">
				<input type="password" name="password" class="input" placeholder="Parool" required />
			</div>
			<button type="submit" class="btn variant-ghost-surface left-1/2 m-2">Logi sisse</button>
		</div>
	</form>
</div>

{#if form?.message}
	<Toast
		message={form.message}
		background={form.message === 'Edukalt sisse logitud'
			? 'variant-filled-primary'
			: 'variant-filled-error'}
		timeout={2000}
	/>
{/if}
