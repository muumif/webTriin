<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<h1>Tere {data.user.name}!</h1>

<form use:enhance method="post">
	<input type="submit" class="button" value="Logi välja" />
</form>
