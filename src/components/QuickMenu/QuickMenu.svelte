<script lang="ts">
	import { all_count } from "../store";
	import { orders, counts } from "../../routes/orders/store";
	import { items } from "../../routes/items/store";
	import { client } from "../store";
	import {
		Button,
		Modal,
		Label,
		Input,
		Spinner,
		SpeedDialButton,
		SpeedDial,
		Toggle,
		Select,
	} from "flowbite-svelte";
	import { DocumentPlus, CloudArrowDown, CloudArrowUp } from "svelte-heros-v2";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	let formModal = false;
	let downloadModal = false;
	let uploadModal = false;
	let formModal_loading = false;
	let upload_loading = false;

	let fileVar: FileList;

	let selectedItem: any;

	const downloads = {
		unpacked: false,
		packed: false,
		unsent: false,
		sent: false
	};

	async function submitOrder() {
		formModal_loading = true;
		let ordered_items = $client.items.split(",");
		const res_post = await fetch("/api/orders", {
			method: "POST",
			body: JSON.stringify({
				client_name: $client.client_name,
				client_nr: $client.client_nr,
				ordered_items: ordered_items
			})
		});
		await res_post.json();
		const res_get = await fetch("/api/orders?status=all", {
			method: "GET"
		});
		const res_get_count = await fetch("/api/orders?count=all", {
			method: "GET"
		});
		const res_get_count_all = await fetch("/api/orders?count=total", {
			method: "GET"
		});
		const data = await res_get.json();
		const data_count = await res_get_count.json();
		$orders = data["orders"];
		$counts = data_count["count"];
		formModal_loading = false;
		formModal = false;
		$client.client_name = "";
		$client.client_nr = "";
		$client.items = "";
		$all_count = await res_get_count_all.json();
	}

	async function downloadOrders() {
		const res = await fetch(
			"/api/filemanager?unpacked=" +
				downloads.unpacked +
				"&packed=" +
				downloads.packed +
				"&unsent=" +
				downloads.unsent +
				"&sent=" +
				downloads.sent,
			{
				method: "GET"
			}
		);
		const filename = await res.json();
		goto(`/public/sheets/${filename.filename}`);
	}

	async function submitForm() {
		upload_loading = true;
		const formData = new FormData();
		const file = fileVar[0];
		formData.append("uploadedFile", file, file.name);
		await fetch("/api/filemanager", {
			method: "POST",
			body: formData
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

		const values = Object.values(data_count.count as Object);
		$all_count = values.reduce((accumulator: number, value: number) => {
			return accumulator + value;
		}, 0);
		upload_loading = false;
		uploadModal = false;
	}
	let items_select: [{value: string, name: string}];
	onMount(async () => {
		const res = await fetch("/api/items", {
			method: "GET"
		});
		const data = await res.json();
		items_select = [{value: String(data.items[0].item_id), name: data.items[0].item_name}];
		for (let i = 1; i < data.items.length; i++) {
			items_select.push({value: String(data.items[i].item_id), name: data.items[i].item_name});
		}
		console.log(items_select);
	})
</script>

<Modal bind:open={formModal} size="xs" autoclose={false}>
	{#if formModal_loading == false}
		<form class="flex flex-col space-y-6" on:submit={submitOrder}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
				Uue tellimuse lisamine
			</h3>
			<Label class="space-y-2">
				<span>Nimi</span>
				<Input
					type="text"
					name="text"
					placeholder="Mihkel Midagi"
					bind:value={$client.client_name}
					required />
			</Label>
			<Label>
				<span>Toode</span>
				<Select class="mt-2" items={items_select} bind:value={selectedItem} required />
			</Label>
			<Label class="space-y-2">
				<span>Telefoni Number</span>
				<Input
					type="tel"
					name="tel"
					placeholder="1234 5678"
					bind:value={$client.client_nr}
					required />
			</Label>
			<Button></Button>
			<Button type="submit" class="w-full">Lisa</Button>
		</form>
	{:else}
		<Spinner color="purple" class="mr-3" />
	{/if}
</Modal>

<Modal bind:open={downloadModal} size="xs" autoclose={false}>
	<form class="flex flex-col space-y-6" on:submit={downloadOrders}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Alla laadimine</h3>
		<Label class="space-y-2 mb-2">
			<Toggle
				on:change={() => {
					if (downloads.unpacked) {
						downloads.unpacked = false;
					} else {
						downloads.unpacked = true;
					}
				}}>Pakkimata</Toggle>
			<Toggle
				on:change={() => {
					if (downloads.packed) {
						downloads.packed = false;
					} else {
						downloads.packed = true;
					}
				}}>Pakitud</Toggle>
			<Toggle
				on:change={() => {
					if (downloads.unsent) {
						downloads.unsent = false;
					} else {
						downloads.unsent = true;
					}
				}}>Saatmata</Toggle>
			<Toggle
				on:change={() => {
					if (downloads.sent) {
						downloads.sent = false;
					} else {
						downloads.sent = true;
					}
				}}>Saadetud</Toggle>
		</Label>
		<Button type="submit" class="w-full">Lae alla</Button>
	</form>
</Modal>

<Modal bind:open={uploadModal} size="xs" autoclose={false}>
	{#if upload_loading == false}
		<form class="flex flex-col space-y-6" on:submit={submitForm}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
				Üles laadimine
			</h3>
			<input
				class="m-auto"
				type="file"
				accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				bind:files={fileVar} />
			<Button type="submit" class="w-full">Lae üles</Button>
		</form>
	{:else}
		<Spinner color="purple" class="mr-3" />
	{/if}
</Modal>

<SpeedDial
	defaultClass="fixed right-4 bottom-20 sm:bottom-20 sm:z-20"
	tooltip="left"
	trigger="click">
	<SpeedDialButton name="Lisa uus" on:click={() => (formModal = true)} tooltip="left">
		<DocumentPlus size="30" />
	</SpeedDialButton>
	<SpeedDialButton name="Lae üles" tooltip="left" on:click={() => (uploadModal = true)}>
		<CloudArrowUp size="30" />
	</SpeedDialButton>
	<SpeedDialButton name="Lae alla" tooltip="left" on:click={() => (downloadModal = true)}>
		<CloudArrowDown size="30" />
	</SpeedDialButton>
</SpeedDial>
