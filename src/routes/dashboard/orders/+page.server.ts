import type { PageServerLoad } from "../$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({}) => {
      const orders = await prisma.order.findMany({
            select: {
                  name: true,
                  phone: true,
                  packed: true,
                  order_card: true,
                  shipped: true,
                  items: {
                        select: {
                              name: true,
                              price: true,
                        }
                  }
            }
      });

      return {
            orders
      }
};