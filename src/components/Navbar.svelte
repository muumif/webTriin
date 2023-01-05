<script lang="ts">
	import { all_count } from "./store";
	import {
		Drawer,
		CloseButton,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		DarkMode
	} from "flowbite-svelte";
	import { Bars3BottomLeft } from "svelte-heros-v2";
	import { sineIn } from "svelte/easing";
	import { onMount } from "svelte";
	let navbar_hidden = true;
	let spanClass = "flex-1 ml-3 whitespace-nowrap";
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	onMount(async () => {
		const res = await fetch("/api/orders?count=all", {
			method: "GET"
		});
		const data = await res.json();
		const values = Object.values(data.count as Object);
		$all_count = values.reduce((accumulator: number, value: number) => {
			return accumulator + value;
		}, 0);
	});
</script>

<div class="text-center fixed top-4 left-4">
	<Bars3BottomLeft size="35" on:click={() => (navbar_hidden = false)} />
</div>
<Drawer transitionType="fly" {transitionParams} bind:hidden={navbar_hidden} id="sidebar2">
	<div class="flex items-center">
		<h5
			id="drawer-navigation-label-3"
			class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
			webTriin
		</h5>
		<CloseButton on:click={() => (navbar_hidden = true)} class="mb-4 dark:text-white" />
	</div>
	<Sidebar autoclose>
		<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
			<SidebarGroup>
				<SidebarItem
					label="Tooted"
					{spanClass}
					aClass="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 sm:text-lg"
					href="/items">
					<svelte:fragment slot="icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Tellimused"
					{spanClass}
					aClass="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 sm:text-lg"
					href="/orders">
					<svelte:fragment slot="icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" /></svg>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200"
							>{$all_count}</span>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
	<!-- <DarkMode /> -->
</Drawer>
