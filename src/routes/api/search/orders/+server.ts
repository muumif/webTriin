import type { OrderModel } from "src/types/order";
import { orders } from "../../../../db/orders";

export async function GET({ url }: any) {
	const query = await url.searchParams;
      const searchParams = query.get("search");

      const data: OrderModel[] = (await orders
            .find({ client_name: { $regex: searchParams, $options: "i" } })
            .toArray()) as OrderModel[];
      return new Response(JSON.stringify({ orders: data }));
 
};