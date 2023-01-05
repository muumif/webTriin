import type { OrderModel } from "src/types/order";
import { orders } from "../../db/orders";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async function () {
	const data = (await orders.find({}).toArray()) as OrderModel[];
	let count = {
		packed: 0,
		sent: 0,
		shipment_card: 0,
		unpacked: 0
	};

	count.packed = await orders.countDocuments({
		"status.packed": true,
		"status.shipment_card": false,
		"status.sent": false,
		"status.at_store": false
	});
	const sent = await orders.countDocuments({ "status.sent": true });
	count.sent = sent + (await orders.countDocuments({ "status.at_store": true }));
	count.shipment_card = await orders.countDocuments({
		"status.shipment_card": true,
		"status.packed": true,
		"status.sent": false,
		"status.at_store": false
	});
	count.unpacked = await orders.countDocuments({
		"status.packed": false,
		"status.at_store": false
	});

	const orderData: any[] = [];
	data.forEach((order) => {
		orderData.push({
			client_name: order.client_name,
			client_nr: order.client_nr,
			ordered_items: order.ordered_items,
			status: order.status,
			updated_at: order.updated_at,
			created_at: order.created_at,
			internal_id: order.internal_id
		});
	});

	return {
		orders: orderData,
		counts: count
	};
};
