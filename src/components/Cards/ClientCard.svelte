<script lang="ts">
	import { all_count } from "../store";
	import { orders, counts } from "../../routes/orders/store";
	import {
		Card,
		ButtonGroup,
		Button,
		Spinner,
		Dropdown,
		DropdownItem,
		Modal,
		DropdownDivider,
		Label,
		Input,
		Textarea
	} from "flowbite-svelte";

	export let client_name: string;
	export let client_nr: string;
	export let client_order: string[];
	export let packed: boolean;
	export let shipment_card: boolean;
	export let sent: boolean;
	export let at_store: boolean;
	export let updated_at: string;
	export let created_at: string;
	export let internal_id: number;

	let packed_disabled: boolean;
	let shipment_card_disabled: boolean;
	let sent_disabled: boolean;

	let dev = false; // TODO: Global dev variable for data that only needs to be seen by me (e.g. internal_id)

	let confirm_order_modal = false;
	let confirm_order_modal_loading = false;

	let edit_order_modal = false;
	let edit_order_modal_loading = false;

	let edit_client_name: string;
	let edit_client_nr: string;
	let edit_client_order: string = client_order.toString();

	async function changeButtonState(id: string, state: boolean) {
		if (id == "packed") {
			packed = state;
			packed_disabled = true;
		}
		if (id == "shipment_card") {
			shipment_card = state;
			shipment_card_disabled = true;
		}
		if (id == "sent") {
			sent = state;
			sent_disabled = true;
		}
		await fetch("/api/orders", {
			method: "PATCH",
			body: JSON.stringify({
				internal_id: internal_id,
				id: id,
				state: state
			})
		});
		const res_get_count = await fetch("/api/orders?count=all", {
			method: "GET"
		});
		const data_count = await res_get_count.json();
		$counts = data_count["count"];
		packed_disabled = false;
		shipment_card_disabled = false;
		sent_disabled = false;
	}

	async function deleteOrder() {
		confirm_order_modal_loading = true;
		await fetch("/api/orders", {
			method: "DELETE",
			body: JSON.stringify({
				internal_id: internal_id
			})
		});
		const res_get = await fetch("/api/orders?status=all", {
			method: "GET"
		});
		const res_get_count = await fetch("/api/orders?count=all", {
			method: "GET"
		});
		const data = await res_get.json();
		const data_count = await res_get_count.json();
		$orders = data["orders"];
		$counts = data_count["count"];
		confirm_order_modal_loading = false;
		confirm_order_modal = false;
		const res_all_count = await fetch("/api/orders?count=all", {
			method: "GET"
		});
		const data_all_count = await res_all_count.json();
		const values = Object.values(data_all_count.count as Object);
		$all_count = values.reduce((accumulator: number, value: number) => {
			return accumulator + value;
		}, 0);
	}

	async function changeToAtStore(_internal_id: number) {
		await fetch("/api/orders", {
			method: "PATCH",
			body: JSON.stringify({
				internal_id: _internal_id,
				id: "at_store",
				state: !at_store
			})
		});
		const res_get = await fetch("/api/orders?status=all", {
			method: "GET"
		});
		const res_get_count = await fetch("/api/orders?count=all", {
			method: "GET"
		});
		const data = await res_get.json();
		const data_count = await res_get_count.json();
		$orders = data["orders"];
		$counts = data_count["count"];
	}

	async function updateOrder() {
		edit_order_modal_loading = true;
		const ordered_items = edit_client_order.split(",");
		await fetch("/api/orders", {
			method: "PUT",
			body: JSON.stringify({
				internal_id: internal_id,
				client_name: client_name,
				client_nr: client_nr,
				ordered_items: ordered_items
			})
		});
		const res_get = await fetch("/api/orders?status=all", {
			method: "GET"
		});
		const data = await res_get.json();
		$orders = data["orders"];
		edit_order_modal_loading = false;
		edit_order_modal = false;
	}
</script>

<Card class="mb-4 mr-2" padding="md">
	<div class="mb-2">
		<div class="relative">
			<h3
				class="text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
				{client_name}
			</h3>
			<Button
				outline={true}
				color="purple"
				pill={true}
				class="!p-2 absolute top-0 right-0"
				size="lg"
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
					on:click={() => {
						changeToAtStore(internal_id);
					}}>Poest kätte saadud</DropdownItem>
				<DropdownDivider />
				<DropdownItem size="md" on:click={() => (confirm_order_modal = true)}
					>Eemalda</DropdownItem>
			</Dropdown>
		</div>
		<p class="text-base tracking-tight text-gray-500 dark:text-white text-center">
			{client_nr}
		</p>
	</div>
	<hr />
	<div class="mb-3 mt-3 text-center">
		<ul>
			{#each client_order as item}
				<li class="text-gray-600 ">{item}</li>
			{/each}
		</ul>
	</div>
	<hr />
	<div class="text-center">
		<p class="text-sm tracking-tight font-bold text-gray-600 text-left inline">Lisatud:</p>
		<p class="text-sm tracking-tight text-gray-500 text-right inline">{created_at}</p>
		<br />
		<p class="text-sm tracking-tight font-bold text-gray-600 text-center inline">
			Viimati muudetud:
		</p>
		<p class="text-sm tracking-tight text-gray-500 text-center inline">{updated_at}</p>
		{#if dev == true}
			<br />
			<p class="text-sm tracking-tight font-bold text-gray-600 text-center inline">
				ID:
			</p>
			<p class="text-sm tracking-tight text-gray-500 text-center inline">
				{internal_id}
			</p>
		{/if}
	</div>
	<div class="m-auto">
		{#if at_store == false}
			<ButtonGroup divClass="grid grid-rows-1 grid-cols-3">
				{#if packed_disabled == true}
					<Button disabled size="xs"
						><Spinner class="mr-3" size="4" color="white" />Pakitud</Button>
				{:else if packed == false}
					<Button
						size="sm"
						color="red"
						on:click={() => changeButtonState("packed", true)}
						>Pakitud</Button>
				{:else}
					<Button
						size="sm"
						color="green"
						on:click={() => changeButtonState("packed", false)}
						>Pakitud</Button>
				{/if}

				{#if shipment_card_disabled == true}
					<Button disabled size="xs"
						><Spinner
							class="mr-3"
							size="4"
							color="white" />Pakikaart</Button>
				{:else if shipment_card == false}
					<Button
						size="sm"
						color="red"
						on:click={() => changeButtonState("shipment_card", true)}
						>Pakikaart</Button>
				{:else}
					<Button
						size="sm"
						color="green"
						on:click={() => changeButtonState("shipment_card", false)}
						>Pakikaart</Button>
				{/if}

				{#if sent_disabled == true}
					<Button disabled size="xs"
						><Spinner
							class="mr-3"
							size="4"
							color="white" />Saadetud</Button>
				{:else if sent == false}
					<Button
						size="sm"
						color="red"
						on:click={() => changeButtonState("sent", true)}
						>Saadetud</Button>
				{:else}
					<Button
						size="sm"
						color="green"
						on:click={() => changeButtonState("sent", false)}
						>Saadetud</Button>
				{/if}
			</ButtonGroup>
		{:else}
			<p class="text-lg tracking-tight font-bold text-red-600 text-center inline">
				Poest kätte saadud
			</p>
		{/if}
	</div>
</Card>

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
				Oled kindel, et soovid kustutada seda tellimust?
			</h3>
			<Button color="red" class="mr-2" on:click={deleteOrder}>Jah</Button>
			<Button color="alternative">Ei</Button>
		</div>
	{:else}
		<Spinner color="purple" class="mr-3" />
	{/if}
</Modal>

<Modal bind:open={edit_order_modal} size="xs" autoclose={false}>
	{#if edit_order_modal_loading == false}
		<form class="flex flex-col space-y-6" on:submit={updateOrder}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
				Muuda tellimust
			</h3>
			<Label class="space-y-2">
				<span>Nimi</span>
				<Input
					type="text"
					name="text"
					bind:value={client_name}
					placeholder="Mihkel Midagi"
					required />
			</Label>
			<Label class="space-y-2">
				<span>Telefoni Number</span>
				<Input
					type="tel"
					name="tel"
					bind:value={client_nr}
					placeholder="1234 5678"
					required />
			</Label>
			<Label class="space-y-1 mb-2">
				<span>Paki sisu</span>
				<Textarea
					rows="2"
					placeholder="Padi, Tool"
					bind:value={edit_client_order}
					required />
			</Label>
			<Button type="submit" class="w-full">Muuda</Button>
		</form>
	{:else}
		<Spinner color="purple" class="mr-3" />
	{/if}
</Modal>
