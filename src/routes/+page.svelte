<script lang="ts">
	import { page } from "$app/stores";
	import Login from "$lib/components/Login.svelte";
	import Toast from "$lib/components/Toast.svelte";

	export let form: { message?: string };
</script>

<Login {form} />
