import type { OrderModel } from "src/types/order";
import { writable } from "svelte/store";

export const orders = writable<OrderModel[]>([]);

export const counts = writable({
	packed: 0,
	sent: 0,
	shipment_card: 0,
	unpacked: 0
});
