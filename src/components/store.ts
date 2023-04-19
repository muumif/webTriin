import { writable } from "svelte/store";

export const client = writable({
	client_name: "",
	client_nr: "",
	items: ""
});

export const item = writable({
	item_name: "",
	item_category: "",
	item_amount: 0,
	item_ordered: 0,
	item_price: 0	
});

export const all_count = writable(0);
