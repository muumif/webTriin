<script lang="ts">
      import { Button, Input, Label, Modal, Select, SpeedDial, SpeedDialButton, Spinner } from "flowbite-svelte";
      import { CloudArrowDown, CloudArrowUp, DocumentPlus } from "svelte-heros-v2";
	import { item } from "../store";
	import { category, items } from "../../routes/items/store";

      let newModal = false;
	let newModalLoading = false;
      let downloadModal = false;
      let uploadModal = false;

	async function createItem() {
		newModalLoading = true;
		const res = await fetch("/api/items", {
			method: "POST",
			body: JSON.stringify({
				item_name: $item.item_name,
				amount: $item.item_amount,
				ordered: $item.item_ordered,
				price: $item.item_price,
				category: $item.item_category
			})
		});
		await res.json();
		const res_get = await fetch("/api/items", {
			method: "GET"
		});
		const data = await res_get.json();
		$items = data["items"];
		newModalLoading = false;
		newModal = false;
	}
</script>

<Modal bind:open={newModal} size="xs" autoclose={false}>
	{#if newModalLoading == false}
		<form class="flex flex-col space-y-6" on:submit={createItem}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
				Uue toote lisamine
			</h3>
			<Label class="space-y-2">
				<span>Toote nimi</span>
				<Input
					type="text"
					name="text"
					bind:value={$item.item_name}
					required />
			</Label>
			<Label>
				<span>Kategooria</span>
				<Select class="mt-2" items={$category} bind:value={$item.item_category} required />
			</Label>
			<Label class="space-y-2">
				<span>Kogus</span>
				<Input
					type="number"
					name="number"
					bind:value={$item.item_amount}
					required />
			</Label>
			<Label class="space-y-2">
				<span>Tellitud</span>
				<Input
					type="number"
					name="number"
					bind:value={$item.item_ordered}
					required />
			</Label>
			<Label class="space-y-2">
				<span>Hind</span>
				<Input
					type="text"
					name="text"
					bind:value={$item.item_price}
					required />
			</Label>
			<Button type="submit" class="w-full">Lisa</Button>
		</form>
	{:else}
		<Spinner color="purple" class="mr-3" />
	{/if}
</Modal>


<SpeedDial
	defaultClass="fixed right-4 bottom-20 sm:bottom-5 sm:z-20"
	tooltip="left"
	trigger="click">
	<SpeedDialButton name="Lisa uus" on:click={() => (newModal = true)} tooltip="left">
		<DocumentPlus size="30" />
	</SpeedDialButton>
	<SpeedDialButton name="Lae üles" tooltip="left" on:click={() => (uploadModal = true)}>
		<CloudArrowUp size="30" />
	</SpeedDialButton>
	<SpeedDialButton name="Lae alla" tooltip="left" on:click={() => (downloadModal = true)}>
		<CloudArrowDown size="30" />
	</SpeedDialButton>
</SpeedDial>
