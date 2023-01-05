import type { ObjectId } from "mongodb";

export type OrderModel = {
	_id: ObjectId;
	client_name: string;
	client_nr: string;
	ordered_items: [string]; // TODO: Make a custom type for this
	status: {
		packed: boolean;
		sent: boolean;
		shipment_card: boolean;
		at_store: boolean;
	};
	updated_at: Date;
	created_at: Date;
	internal_id: number;
};
