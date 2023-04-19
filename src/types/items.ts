import type { ObjectId } from "mongodb";

export type ItemModel = {
	_id: ObjectId;
      item_category: string;
      item_name: string;
      price: string;
      item_id: number;
      amount: number;
      ordered: number;
};
