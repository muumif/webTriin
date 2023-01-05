<script lang="ts">
	import { orders, counts } from "./store";
	import QuickMenu from "../../components/QuickMenu.svelte";
	import ClientCard from "../../components/ClientCard.svelte";
	import { Tabs, TabItem, Badge } from "flowbite-svelte";
	import Navbar from "../../components/Navbar.svelte";
	export let data;

	$orders = data["orders"];
	$counts = data["counts"];

	async function refetchData(status: string) {
		const res = await fetch("/api/orders?status=" + status, {
			method: "GET"
		});
		const data = await res.json();
		$orders = data["orders"];
	}
</script>

<svelte:head>
	<title>Tellimused</title>
</svelte:head>

<Navbar />

<div class="w-full mb-20" />

<Tabs
	style="underline"
	defaultClass="fixed grid grid-cols-4 bottom-0 z-50 bg-slate-200 pr-4 sm:w-full sm:bg-slate-100 sm:pr-0 sm:flex sm:items-center sm:z-10">
	<TabItem open on:click={() => refetchData("unpacked")}>
		<div slot="title" class="flex items-center">
			<p class="text-xs sm:text-base sm:pr-2">Pakkimata</p>
			<Badge large color="blue">{$counts.unpacked}</Badge>
		</div>
		<div class="sm:grid sm:grid-cols-4">
			{#each $orders as order}
				{#if order.status.packed == false && order.status.at_store == false}
					<ClientCard
						client_name={order.client_name}
						client_nr={order.client_nr}
						client_order={order.ordered_items}
						packed={order.status.packed}
						shipment_card={order.status.shipment_card}
						sent={order.status.sent}
						at_store={order.status.at_store}
						updated_at={new Date(order.updated_at)
							.toLocaleString("en-GB", {
								dateStyle: "short",
								timeZone: "Europe/Tallinn",
								timeStyle: "short"
							})
							.replaceAll("/", ".")}
						created_at={new Date(order.created_at)
							.toLocaleString("en-GB", {
								dateStyle: "short",
								timeZone: "Europe/Tallinn",
								timeStyle: "short"
							})
							.replaceAll("/", ".")}
						internal_id={order.internal_id} />
				{/if}
			{/each}
			<div class="h-24 w-full" />
		</div>
	</TabItem>
	<TabItem on:click={() => refetchData("packed")}>
		<div slot="title" class="flex items-center">
			<p class="text-xs sm:text-base sm:pr-2">Pakitud</p>
			<Badge large color="blue">{$counts.packed}</Badge>
		</div>
		<div class="sm:grid sm:grid-cols-4">
			{#each $orders as order}
				{#if order.status.packed == true && order.status.shipment_card == false && order.status.sent == false && order.status.at_store == false}
					<ClientCard
						client_name={order.client_name}
						client_nr={order.client_nr}
						client_order={order.ordered_items}
						packed={order.status.packed}
						shipment_card={order.status.shipment_card}
						sent={order.status.sent}
						at_store={order.status.at_store}
						updated_at={new Date(order.updated_at)
							.toLocaleString("en-GB", {
								dateStyle: "short",
								timeZone: "Europe/Tallinn",
								timeStyle: "short"
							})
							.replaceAll("/", ".")}
						created_at={new Date(order.created_at)
							.toLocaleString("en-GB", {
								dateStyle: "short",
								timeZone: "Europe/Tallinn",
								timeStyle: "short"
							})
							.replaceAll("/", ".")}
						internal_id={order.internal_id} />
				{/if}
			{/each}
			<div class="h-24 w-full" />
		</div>
	</TabItem>
	<TabItem on:click={() => refetchData("shipment_card")}>
		<div slot="title" class="flex items-center">
			<p class="text-xs sm:text-base sm:pr-2">Saatmata</p>
			<Badge large color="blue">{$counts.shipment_card}</Badge>
		</div>
		<div class="sm:grid sm:grid-cols-4">
			{#each $orders as order}
				{#if order.status.packed == true && order.status.shipment_card == true && order.status.sent == false && order.status.at_store == false}
					<ClientCard
						client_name={order.client_name}
						client_nr={order.client_nr}
						client_order={order.ordered_items}
						packed={order.status.packed}
						shipment_card={order.status.shipment_card}
						sent={order.status.sent}
						at_store={order.status.at_store}
						updated_at={new Date(order.updated_at)
							.toLocaleString("en-GB", {
								dateStyle: "short",
								timeZone: "Europe/Tallinn",
								timeStyle: "short"
							})
							.replaceAll("/", ".")}
						created_at={new Date(order.created_at)
							.toLocaleString("en-GB", {
								dateStyle: "short",
								timeZone: "Europe/Tallinn",
								timeStyle: "short"
							})
							.replaceAll("/", ".")}
						internal_id={order.internal_id} />
				{/if}
			{/each}
			<div class="h-24 w-full" />
		</div>
	</TabItem>
	<TabItem on:click={() => refetchData("sent")}>
		<div slot="title" class="flex items-center">
			<p class="text-xs sm:text-base sm:pr-2">Saadetud</p>
			<Badge large color="blue">{$counts.sent}</Badge>
		</div>
		<div class="sm:grid sm:grid-cols-4">
			{#each $orders as order}
				{#if order.status.sent == true || order.status.at_store == true}
					<ClientCard
						client_name={order.client_name}
						client_nr={order.client_nr}
						client_order={order.ordered_items}
						packed={order.status.packed}
						shipment_card={order.status.shipment_card}
						sent={order.status.sent}
						at_store={order.status.at_store}
						updated_at={new Date(order.updated_at)
							.toLocaleString("en-GB", {
								dateStyle: "short",
								timeZone: "Europe/Tallinn",
								timeStyle: "short"
							})
							.replaceAll("/", ".")}
						created_at={new Date(order.created_at)
							.toLocaleString("en-GB", {
								dateStyle: "short",
								timeZone: "Europe/Tallinn",
								timeStyle: "short"
							})
							.replaceAll("/", ".")}
						internal_id={order.internal_id} />
				{/if}
			{/each}
			<div class="h-24 w-full" />
		</div>
	</TabItem>
</Tabs>

<QuickMenu />
