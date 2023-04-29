import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({}) => {
      const itemsQuery = await prisma.item.findMany();
      const items = itemsQuery.map((item) => ({
            name: item.name,
            price: item.price,
            category_id: item.category_id,
            sold: item.sold,
            stock: item.stock,
            category: ""
      }));

      for (let i = 0; i < items.length; i++) {
            const category = await prisma.category.findUnique({
                  where: {
                        id: items[i].category_id
                  }
            })
            if (!category) return {
                  message: "Midagi läks valesti laadimisel",
                  messageBackground: "variant-filled-error"
            }
            items[i].category = category.name;
      }

      return {
            items
      }
}