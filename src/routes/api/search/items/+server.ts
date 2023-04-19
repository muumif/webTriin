import { items } from "../../../../db/items";
import type { ItemModel } from "src/types/items";

export async function GET({ url }: any) {
	const query = await url.searchParams;
      const searchParams = query.get("search");

      const data: ItemModel[] = (await items
            .find({ item_name: { $regex: searchParams, $options: "i" } })
            .toArray()) as ItemModel[];
      return new Response(JSON.stringify({ items: data }));
 
}