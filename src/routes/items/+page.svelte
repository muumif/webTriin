<script type="ts">
      import { category, items } from "./store";
      import { Button, ChevronUp, Hr, Search, Table, TableBody, TableHead, TableHeadCell } from "flowbite-svelte";
      import { ChevronDown } from "svelte-heros-v2";
      import QuickMenuItem from "../../components/QuickMenu/QuickMenuItem.svelte";
	  import ItemRowCell from "../../components/Cards/ItemRowCell.svelte";

      export let data;

      let search_query = "";
      let item_order: string = "item_id";

      async function search() {
            const search_res = await fetch(`/api/search/items?search=${search_query}`, {
			method: "GET"
		});
		const data = await search_res.json();
		$items = data["items"];
      }

      function sortBy(item: string) {
            if (item == "item_id") {
                  $items = $items.sort((a, b) => a.item_id - b.item_id);
            } else if (item == "item_name") {
                  $items = $items.sort((a, b) => a.item_name.localeCompare(b.item_name));
            } else if (item == "item_category") {
                  $items = $items.sort((a, b) => a.item_category.localeCompare(b.item_category));
            } else if (item == "price") {
                  $items = $items.sort((a, b) => a.price - b.price);
            } else if (item == "amount") {
                  $items = $items.sort((a, b) => a.amount - b.amount);
            } else if (item == "ordered") {
                  $items = $items.sort((a, b) => a.ordered - b.ordered);
            }
            item_order = item;
      }

      $items = data["items"];
      $category = data["categories"];
</script>

<div class="top-0 right-2 absolute w-2/6">
      <Search class="mt-2" bind:value={search_query} on:change={search} placeholder="Nime järgi otsing">  
            <Button on:click={search}>Otsi</Button>
      </Search>
</div>
<div class="mb-16 w-full h-1"/>
<Hr class="mx-auto" height="h-px"/>

<Table hoverable={true} divClass="h-full">
<TableHead>
      {#if item_order == "item_id"}
      <TableHeadCell>ID<ChevronDown size="20" class="inline" on:click={() => sortBy("item_id")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Nimi<ChevronUp size="20" class="inline" on:click={() => sortBy("item_name")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kategooria<ChevronUp size="20" class="inline" on:click={() => sortBy("item_category")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Hind<ChevronUp size="20" class="inline" on:click={() => sortBy("price")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kogus<ChevronUp size="20" class="inline" on:click={() => sortBy("amount")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Tellitud<ChevronUp size="20" class="inline" on:click={() => sortBy("ordered")} strokeWidth="2"/></TableHeadCell>
      {:else if item_order == "item_name"}
      <TableHeadCell>ID<ChevronUp size="20" class="inline" on:click={() => sortBy("item_id")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Nimi<ChevronDown size="20" class="inline" on:click={() => sortBy("item_name")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kategooria<ChevronUp size="20" class="inline" on:click={() => sortBy("item_category")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Hind<ChevronUp size="20" class="inline" on:click={() => sortBy("price")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kogus<ChevronUp size="20" class="inline" on:click={() => sortBy("amount")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Tellitud<ChevronUp size="20" class="inline" on:click={() => sortBy("ordered")} strokeWidth="2"/></TableHeadCell>
      {:else if item_order == "item_category"}
      <TableHeadCell>ID<ChevronUp size="20" class="inline" on:click={() => sortBy("item_id")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Nimi<ChevronUp size="20" class="inline" on:click={() => sortBy("item_name")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kategooria<ChevronDown size="20" class="inline" on:click={() => sortBy("item_category")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Hind<ChevronUp size="20" class="inline" on:click={() => sortBy("price")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kogus<ChevronUp size="20" class="inline" on:click={() => sortBy("amount")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Tellitud<ChevronUp size="20" class="inline" on:click={() => sortBy("ordered")} strokeWidth="2"/></TableHeadCell>
      {:else if item_order == "price"}
      <TableHeadCell>ID<ChevronUp size="20" class="inline" on:click={() => sortBy("item_id")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Nimi<ChevronUp size="20" class="inline" on:click={() => sortBy("item_name")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kategooria<ChevronUp size="20" class="inline" on:click={() => sortBy("item_category")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Hind<ChevronDown size="20" class="inline" on:click={() => sortBy("price")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kogus<ChevronUp size="20" class="inline" on:click={() => sortBy("amount")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Tellitud<ChevronUp size="20" class="inline" on:click={() => sortBy("ordered")} strokeWidth="2"/></TableHeadCell>
      {:else if item_order == "amount"}
      <TableHeadCell>ID<ChevronUp size="20" class="inline" on:click={() => sortBy("item_id")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Nimi<ChevronUp size="20" class="inline" on:click={() => sortBy("item_name")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kategooria<ChevronUp size="20" class="inline" on:click={() => sortBy("item_category")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Hind<ChevronUp size="20" class="inline" on:click={() => sortBy("price")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kogus<ChevronDown size="20" class="inline" on:click={() => sortBy("amount")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Tellitud<ChevronUp size="20" class="inline" on:click={() => sortBy("ordered")} strokeWidth="2"/></TableHeadCell>
      {:else if item_order == "ordered"}
      <TableHeadCell>ID<ChevronUp size="20" class="inline" on:click={() => sortBy("item_id")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Nimi<ChevronUp size="20" class="inline" on:click={() => sortBy("item_name")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kategooria<ChevronUp size="20" class="inline" on:click={() => sortBy("item_category")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Hind<ChevronUp size="20" class="inline" on:click={() => sortBy("price")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Kogus<ChevronUp size="20" class="inline" on:click={() => sortBy("amount")} strokeWidth="2"/></TableHeadCell>
      <TableHeadCell>Tellitud<ChevronDown size="20" class="inline" on:click={() => sortBy("ordered")} strokeWidth="2"/></TableHeadCell>
      {/if}
      <TableHeadCell>
            <span class="sr-only"> Edit </span>
      </TableHeadCell>
</TableHead>
<TableBody tableBodyClass="divide-y">
{#each $items as item}
<ItemRowCell 
      item_id={item.item_id}
      item_name={item.item_name}
      item_category={item.item_category}
      item_price={item.price}
      item_amount={item.amount}
      item_ordered={item.ordered}
/>
{/each}
</TableBody>
</Table>

<QuickMenuItem />