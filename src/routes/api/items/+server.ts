import type { RequestEvent } from "node_modules/@sveltejs/kit/types";
import { items } from "../../../db/items";
import type { ObjectId } from "mongodb";
import { categories } from "../../../db/categories";
import type { CategoryModel } from "src/types/category";

export async function GET({ url }: RequestEvent) {
      const data = await items.find().toArray();
      return new Response(JSON.stringify({ items: data }));
}

export async function POST({ request }: RequestEvent) {
      const body = await request.json();
      const item_name: string = body.item_name;
      const price: string = body.price;
      const amount: number = body.amount;
      const ordered: number = body.ordered;
      const category: string = body.category;

      const latest = (await items
            .find({})
            .sort({ item_id: -1 })
            .limit(1)
            .toArray()) as item[];
      let item_id: number;
      if (latest.length == 0) {
            item_id = 1;
      } else {
            item_id = latest[0].item_id + 1;
      }

      const category_search = await categories.findOne({ value: category }) as CategoryModel;

      await items.insertOne({
            item_name: item_name,
            item_category: category_search.name,
            price: price,
            amount: Number(amount),
            ordered: Number(ordered),
            item_id: item_id
      });
            
      return new Response(
            JSON.stringify({
                  item_name: item_name,
                  item_category: category_search.name,
                  price: price,
                  amount: Number(amount),
                  ordered: Number(ordered),
                  item_id: item_id
            })
      );
}

export async function DELETE({ request}: RequestEvent) {
      const body = await request.json();
      const item_id: number = body.item_id;

      await items.deleteOne({ item_id: item_id });
      return new Response(JSON.stringify({ Deleted: true }));
}

export async function PUT({ request }: RequestEvent) {
      const body = await request.json();
      const item_id: number = body.item_id;
      const item_name: string = body.item_name;
      const amount: number = body.amount;
      const ordered: number = body.ordered;
      const price: number = body.price;
      const category: string = body.category;
      const category_search = await categories.findOne({ value: category }) as CategoryModel;

      await items.updateOne(
            { item_id: item_id },
            {
                  $set: {
                        item_category: category_search.name,
                        item_id: item_id,
                        item_name: item_name,
                        amount: Number(amount),
                        ordered: Number(ordered),
                        price: price,
                  }
            }
      );
      return new Response(JSON.stringify({ Updated: true }));
}

export type item = {
	_id: ObjectId;
      item_desc: string;
      item_name: string;
      price: string;
      item_id: number;
      amount: number;
      ordered: number;
};
