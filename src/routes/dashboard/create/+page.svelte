<script lang="ts">
      import { enhance } from "$app/forms";
	  import Toast from "$lib/components/Toast.svelte";
	  import { Autocomplete, InputChip } from "@skeletonlabs/skeleton";


      export let data;
      export let form: { message?: string; messageBackground?: string };

	let inputChip = "";
	let items = data.items.map((item) => {
		return {
			label: item.name,
			value: item.name,

		}
	});
	let inputChipList: string[] = [];

	function onInputChipSelect(event: any): void {
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';
		}
	}
</script>

{#if form?.message && form?.messageBackground}
	<Toast message={form.message} background={form.messageBackground} />
{/if}


<div class="flex">
	<div class="m-4">
	<form
		use:enhance
		method="post"
		class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
		action="?/createitem">
		<div class="inline-grid gird-cols-1 gap-1">
                  <span class="text-center text-lg font-bold">Lisa uus toode</span>
			<div class="p-2">
				<input
					type="text"
					name="name"
					class="input"
					placeholder="Nimi"
					required />
			</div>
                  <div class="p-2">
                        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                              <div class="input-group-shim"><span class="text-lg">€</span></div>
                              <input type="text" name="price" placeholder="Hind" />
                        </div>
			</div>
			<div class="p-2">
				<input
					type="number"
					name="stock"
					class="input"
					placeholder="Tooteid kokku"
					required />
			</div>
                  <div class="p-2">
				<input
					type="number"
					name="sold"
					class="input"
					placeholder="Tooteid müüdud"
					required />
			</div>
                  <div class="p-2">
                        <select class="select" name="category">
                              {#each data.categories as category}
                                    <option value={category.id}>{category.name}</option>
                              {/each}
                        </select>
                  </div>                        
			<button type="submit" class="btn variant-ghost-surface left-1/2 m-2"
				>Lisa</button>
		</div>
	</form>
	</div>
	<div class="m-4">
		<form
			use:enhance
			method="post"
			class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
			action="?/createorder">
			<div class="inline-grid gird-cols-1 gap-1">
				<span class="text-center text-lg font-bold">Lisa uus tellimus</span>
				<div class="p-2">
					<input
						type="text"
						name="name"
						class="input"
						placeholder="Nimi"
						required />
				</div>
				<div class="p-2">
					<input
						type="number"
						name="number"
						class="input"
						placeholder="Telefoni number"
						required />
				</div>
				<div class="p-2">
					<InputChip bind:input={inputChip} name="items" bind:value={inputChipList} class="mb-2" placeholder="Tooted..."/>
					<div class="card w-full max-w-sm max-h-36 p-2 overflow-y-auto border-2 border-surface-500/50">
						<Autocomplete
							bind:input={inputChip}
							options={items}
							denylist={inputChipList}
							on:selection={onInputChipSelect}>
						</Autocomplete>
					</div>
				</div>                    
				<button type="submit" class="btn variant-ghost-surface left-1/2 m-2"
					>Lisa</button>
			</div>
		</form>
	</div>
	<div class="m-4">
		<form
			use:enhance
			method="post"
			class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
			action="?/createcategory">
			<div class="inline-grid gird-cols-1 gap-1">
				<span class="text-center text-lg font-bold">Lisa uus kategooria</span>
				<div class="p-2">
					<input
						type="text"
						name="name"
						class="input"
						placeholder="Nimi"
						required />
				</div>                 
				<button type="submit" class="btn variant-ghost-surface left-1/2 m-2"
					>Lisa</button>
			</div>
		</form>
		<form
			use:enhance
			method="post"
			class="mt-4 border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
			action="?/deletecategory">
			<div class="inline-grid gird-cols-1 gap-1">
				<span class="text-center text-lg font-bold">Eemalda kategooria</span>
				<div class="p-2">
					<select class="select" name="category">
						{#each data.categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>                 
				<button type="submit" class="btn variant-ghost-surface left-1/2 m-2"
					>Eemalda</button>
			</div>
		</form>
	</div>
</div>