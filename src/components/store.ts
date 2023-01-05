import { writable } from "svelte/store";

export const client = writable({
	client_name: "",
	client_nr: "",
	items: ""
});

export const all_count = writable(0);
