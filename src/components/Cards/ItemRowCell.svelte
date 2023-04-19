<script lang="ts">
	import { Alert, Badge, Button, Checkbox, Dropdown, DropdownDivider, DropdownItem, Hr, Input, Label, Modal, Select, Spinner, TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { category, items } from "../../routes/items/store";

	export let item_name: string;
	export let item_category: string;
	export let item_price: string;
	export let item_amount: number;
	export let item_ordered: number;
	export let item_id: number;

	let edit_order_modal: boolean = false;
	let edit_order_modal_loading: boolean = false;
	let confirm_order_modal: boolean = false;
	let confirm_order_modal_loading: boolean = false;

	let item_empty: boolean = item_amount <= item_ordered ? true : false;

	async function deleteItem() {
		confirm_order_modal_loading = true;
		await fetch("/api/items", {
			method: "DELETE",
			body: JSON.stringify({
				item_id: item_id,
			})
		});
		const res = await fetch("/api/items", {method: "GET"});
		const data = await res.json();
		$items = data["items"];
		confirm_order_modal_loading = false;
		confirm_order_modal = false;
	}

	async function updateItem() {
		edit_order_modal_loading = true;
		if (regExPrice() == false) {
			const res = await fetch("/api/items", {method: "GET"});
			const data = await res.json();
			$items = data["items"];
			edit_order_modal_loading = false;
			edit_order_modal = false;
			return;
		}
		await fetch("/api/items", {
			method: "PUT",
			body: JSON.stringify({
				item_id: item_id,
				item_name: item_name,
				amount: item_amount,
				ordered: item_ordered,
				price: item_price,
				category: item_category
			})
		});
		const res = await fetch("/api/items", {method: "GET"});
		const data = await res.json();
		item_empty = item_amount <= item_ordered ? true : false;
		$items = data["items"];
		edit_order_modal_loading = false;
		edit_order_modal = false;
	}

	function regExPrice() {
		const regex = new RegExp("^[0-9]+(\.[0-9][0-9])?$");
		if (regex.test(item_price)) {
			return true;
		} else {
			alert("Sobimatu hinnavorming. Kasutage järgmist vormingut: 0.00");
			return false;
		}
	}
</script>

<TableBodyRow>

	{#if item_empty == false}
	<TableBodyCell>
		{item_id}
		<Badge color="red" border class="px-2.5 py-0.5 ml-2">Otsas</Badge>
	</TableBodyCell>
	{:else}
	<TableBodyCell>
		{item_id}
		<Badge color="green" border class="px-2.5 py-0.5 ml-2">Olemas</Badge>
	</TableBodyCell>
	{/if}
	<TableBodyCell>{item_name}</TableBodyCell>
	<TableBodyCell>{item_category}</TableBodyCell>
	<TableBodyCell>{item_price}€</TableBodyCell>
	<TableBodyCell>{item_amount}</TableBodyCell>
	<TableBodyCell>{item_ordered}</TableBodyCell>
      <TableBodyCell>
		<Button
		outline={true}
		pill={true}
		size="xs"
		><svg
			aria-hidden="true"
			class="w-5 h-5"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
				clip-rule="evenodd" /></svg
		></Button>
		<Dropdown>
			<DropdownItem size="md" on:click={() => (edit_order_modal = true)}
				>Muuda</DropdownItem>
			<DropdownItem
				size="md"
			>Lisa tellimusi</DropdownItem>
			<DropdownDivider />
			<DropdownItem size="md" on:click={() => (confirm_order_modal = true)}
				>Eemalda</DropdownItem>
		</Dropdown>
	</TableBodyCell>
</TableBodyRow>

<Modal bind:open={edit_order_modal} size="xs" autoclose={false}>
	{#if edit_order_modal_loading == false}
		<form class="flex flex-col space-y-6" on:submit={updateItem}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
				Muuda tellimust
			</h3>
			<Label class="space-y-2">
				<span>Toote nimi</span>
				<Input
					type="text"
					name="text"
					bind:value={item_name}
					required />
			</Label>
			<Label>
				<span>Kategooria</span>
				<Select class="mt-2" items={$category} bind:value={item_category} required />		
			</Label>
			<Label class="space-y-2">
				<span>Kogus</span>
				<Input
					type="number"
					name="number"
					bind:value={item_amount}
					required />
			</Label>
			<Label class="space-y-2">
				<span>Tellitud</span>
				<Input
					type="number"
					name="number"
					bind:value={item_ordered}
					required />
			</Label>
			<Label class="space-y-2">
				<span>Hind</span>
				<Input
					type="text"
					name="text"
					bind:value={item_price}
					required />
			</Label>
			<Button type="submit" class="w-full">Muuda</Button>
		</form>
	{:else}
		<Spinner color="purple" class="mr-3" />
	{/if}
</Modal>

<Modal bind:open={confirm_order_modal} size="xs" autoclose>
	{#if confirm_order_modal_loading == false}
		<div class="text-center">
			<svg
				aria-hidden="true"
				class="mx-auto mb-2 w-14 h-14 text-gray-400 dark:text-gray-200"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
			<h3 class="mb-2 text-lg font-normal text-gray-500 dark:text-gray-400">
				Oled kindel, et soovid kustutada seda tooted?
			</h3>
			<Button color="red" class="mr-2" on:click={deleteItem}>Jah</Button>
			<Button color="alternative">Ei</Button>
		</div>
	{:else}
		<Spinner color="purple" class="mr-3" />
	{/if}
</Modal>