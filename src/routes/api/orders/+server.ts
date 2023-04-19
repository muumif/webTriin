import type { ObjectId } from "mongodb";
import type { OrderModel } from "src/types/order";
import { orders } from "../../../db/orders";

export async function GET({ url }: any) {
	const query = await url.searchParams;
	if (query.get("status")) {
		let data: OrderModel[] = [];
		switch (query.get("status")) {
			case "packed":
				data = (await orders
					.find({ "status.packed": true })
					.toArray()) as OrderModel[];
				break;
			case "sent":
				data = (await orders
					.find({ $or: [{ "status.at_store": true }, { "status.sent": true }] })
					.toArray()) as OrderModel[];
				break;
			case "shipment_card":
				data = (await orders
					.find({ "status.shipment_card": true })
					.toArray()) as OrderModel[];
				break;
			case "unpacked":
				data = (await orders
					.find({ "status.packed": false })
					.toArray()) as OrderModel[];
				break;
			case "all":
				data = (await orders.find().toArray()) as OrderModel[];
				break;
		}
		return new Response(JSON.stringify({ orders: data }));
	} else if (query.get("count")) {
		let count: any = {};
		switch (query.get("count")) {
			case "all":
				count.packed = await orders.countDocuments({
					"status.packed": true,
					"status.shipment_card": false,
					"status.sent": false,
					"status.at_store": false
				});
				const sent = await orders.countDocuments({ "status.sent": true });
				count.sent =
					sent + (await orders.countDocuments({ "status.at_store": true }));
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
				break;
			case "total":
				count.total = await orders.countDocuments({});
				break;
		}
		return new Response(JSON.stringify({ count: count }));
	}
	return new Response(JSON.stringify({ message: "No query provided" }));
}

export async function POST({ request }: any) {
	const body = await request.json();
	const client_name = body.client_name;
	const client_nr = body.client_nr;
	const ordered_items = body.ordered_items;

	const createdAt = new Date();

	const latest = (await orders
		.find({})
		.sort({ internal_id: -1 })
		.limit(1)
		.toArray()) as client[];
	let internal_id: number;
	if (latest.length == 0) {
		internal_id = 1;
	} else {
		internal_id = latest[0].internal_id + 1;
	}

	await orders.insertOne({
		client_name: client_name,
		client_nr: client_nr,
		internal_id: internal_id,
		ordered_items: ordered_items,
		status: {
			packed: false,
			sent: false,
			shipment_card: false,
			at_store: false
		},
		updated_at: createdAt,
		created_at: createdAt
	});

	return new Response(
		JSON.stringify({
			client_name: client_name,
			client_nr: client_nr,
			ordered_items: ordered_items,
			status: {
				packed: false,
				sent: false,
				shipment_card: false,
				at_store: false
			},
			updated_at: createdAt,
			created_at: createdAt
		})
	);
}

export async function DELETE({ request }: any) {
	const body = await request.json();
	const internal_id = body.internal_id;

	const data = await orders.deleteOne({ internal_id: internal_id });
	return new Response(JSON.stringify(data));
}

export async function PATCH({ request }: any) {
	const body = await request.json();
	const internal_id = body.internal_id;
	const id = body.id;
	const state = body.state;

	if (id == "packed") {
		const client = (await orders.findOne({ internal_id: internal_id })) as client;
		await orders.updateOne(
			{ internal_id: internal_id },
			{
				$set: {
					status: {
						packed: state,
						sent: client.status.sent,
						shipment_card: client.status.shipment_card,
						at_store: client.status.at_store
					}
				}
			}
		);
		await orders.updateOne(
			{ internal_id: internal_id },
			{ $set: { updated_at: new Date() } }
		);
	}
	if (id == "shipment_card") {
		const client = (await orders.findOne({ internal_id: internal_id })) as client;
		await orders.updateOne(
			{ internal_id: internal_id },
			{
				$set: {
					status: {
						packed: client.status.packed,
						sent: client.status.sent,
						shipment_card: state,
						at_store: client.status.at_store
					}
				}
			}
		);
		await orders.updateOne(
			{ internal_id: internal_id },
			{ $set: { updated_at: new Date() } }
		);
	}
	if (id == "sent") {
		const client = (await orders.findOne({ internal_id: internal_id })) as client;
		await orders.updateOne(
			{ internal_id: internal_id },
			{
				$set: {
					status: {
						packed: client.status.packed,
						sent: state,
						shipment_card: client.status.shipment_card,
						at_store: client.status.at_store
					}
				}
			}
		);
		await orders.updateOne(
			{ internal_id: internal_id },
			{ $set: { updated_at: new Date() } }
		);
	}
	if (id == "at_store") {
		const client = (await orders.findOne({ internal_id: internal_id })) as client;
		await orders.updateOne(
			{ internal_id: internal_id },
			{
				$set: {
					status: {
						packed: client.status.packed,
						sent: client.status.sent,
						shipment_card: client.status.shipment_card,
						at_store: state
					}
				}
			}
		);
		await orders.updateOne(
			{ internal_id: internal_id },
			{ $set: { updated_at: new Date() } }
		);
	}

	return new Response(JSON.stringify({ Updated: true }));
}

export async function PUT({ request }: any) {
	const body = await request.json();
	const internal_id: number = body.internal_id;
	const client_name: string = body.client_name;
	const client_nr: string = body.client_nr;
	const ordered_items: string[] = body.ordered_items;

	const client = (await orders.findOne({ internal_id: internal_id })) as client;

	await orders.updateOne(
		{ internal_id: internal_id },
		{
			$set: {
				internal_id: internal_id,
				client_name: client_name,
				client_nr: client_nr,
				ordered_items: ordered_items,
				status: {
					packed: client.status.packed,
					sent: client.status.sent,
					shipment_card: client.status.shipment_card,
					at_store: client.status.at_store
				},
				updated_at: new Date(),
				created_at: client.created_at
			}
		}
	);

	return new Response(JSON.stringify({ Updated: true }));
}

export type client = {
	_id: ObjectId;
	internal_id: number;
	client_name: string;
	ordered_items: [];
	status: {
		sent: boolean;
		packed: boolean;
		shipment_card: boolean;
		at_store: boolean;
	};
	updated_at: Date;
	created_at: Date;
};
