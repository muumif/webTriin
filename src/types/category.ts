import type { ObjectId } from "mongodb";

export type CategoryModel = {
	_id: ObjectId;
      name: string;
      value: string;
};
