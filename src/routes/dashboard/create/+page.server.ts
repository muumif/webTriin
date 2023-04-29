import type { Actions, PageServerLoad } from "../items/$types";
import { prisma } from "$lib/server/prisma";
import { Prisma, type Item } from "@prisma/client";
import { LuciaError } from "lucia-auth";

export const load: PageServerLoad = async ({}) => {
      const categories = await prisma.category.findMany();
      const items = await prisma.item.findMany();

      return {
            categories,
            items
      }
}



export const actions: Actions = {
	createitem: async ({ request }) => {
            const form = await request.formData();
            const name = form.get("name");
            const price = form.get("price");
            const stock = form.get("stock");
            const sold = form.get("sold");
            const category = form.get("category");

            if (!name || !price || !stock || !sold || !category || typeof name != "string" || typeof price != "string" || typeof stock != "string" || typeof sold != "string" || typeof category != "string")
			return {
				message: "Kehtetud andmed",
				messageBackground: "variant-filled-error"
			};

            try {
                  const categoryFind = await prisma.category.findUnique({
                        where: {
                              id: parseInt(category)
                        }
                  })
                  if (!categoryFind)
                        return {
                              message: "Kategooriat ei leitud",
                              messageBackground: "variant-filled-error"
                        }

                  const item = await prisma.item.create({
                        data: {
                              name: name,
                              price: parseInt(price),
                              stock: parseInt(stock),
                              sold: parseInt(sold),
                              category_id: categoryFind.id,
                        }
                  });
                  return {
                        message: `Toode ${item.name} loodud!`,
                        messageBackground: "variant-filled-primary"
                  };
            } catch (error) {
			console.error(error);
			return {
				message: "Midagi läks valesti",
				messageBackground: "variant-filled-error"
			};
		}
      },
      createorder: async ({ request }) => {
            const form = await request.formData();
            const name = form.get("name");
            const number = form.get("number");
            const items = form.getAll("items");
            if (!name || !number || !items || typeof name != "string" || typeof number != "string" || typeof items != "object")
                  return {
                        message: "Kehtetud andmed",
                        messageBackground: "variant-filled-error"
                  };
            try {
                  const itemsToCreate: {id: number}[] = [];
                  for (let i = 0; i < items.length; i++) {
                        const item = items[i] as string;
                        const itemQuery = await prisma.item.findFirst({
                              where: {
                                    name: item
                              }
                        });
                        if (!itemQuery)
                              return {
                                    message: "Toodet ei leitud",
                                    messageBackground: "variant-filled-error"
                              }
                        itemsToCreate.push({id: itemQuery.id});
                  }
                  console.log(itemsToCreate);

                  const order = await prisma.order.create({
                        data: {
                              name: name,
                              phone: parseInt(number),
                        }
                  })

                  await prisma.order.update({
                        where: {
                              id: order.id
                        },
                        data: {
                              items: {
                                    connect: itemsToCreate
                              }
                        }
                  });

                  return {
                        message: `Tellimus ${order.name} loodud!`,
                        messageBackground: "variant-filled-primary"
                  };
            } catch (error) {
                  console.error(error);
                  return {
                        message: "Midagi läks valesti",
                        messageBackground: "variant-filled-error"
                  };
            }
      },
      createcategory: async ({ request }) => {
            const form = await request.formData();
            const name = form.get("name");
            if (!name || typeof name != "string")
                  return {
                        message: "Kehtetud andmed",
                        messageBackground: "variant-filled-error"
                  };
            try {
                  const category = await prisma.category.create({
                        data: {
                              name: name
                        }
                  });
                  return {
                        message: `Kategooria ${category.name} loodud!`,
                        messageBackground: "variant-filled-primary"
                  };
            } catch (error) {
                  if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002" &&
				error.message?.includes("category_name_key")
			) {
				return {
					message: "Kategooria nimi on juba kasutusel",
					messageBackground: "variant-filled-error"
				};
			}
			if (error instanceof LuciaError && error.message === "AUTH_DUPLICATE_KEY_ID") {
				return {
					message: "Kategooria nimi on juba kasutusel",
					messageBackground: "variant-filled-error"
				};
			}
                  console.error(error);
                  return {
                        message: "Midagi läks valesti",
                        messageBackground: "variant-filled-error"
                  };
            }
      },
      deletecategory: async ({ request }) => {
            const form = await request.formData();
            const category = form.get("category");
            if (!category || typeof category != "string")
                  return {
                        message: "Kehtetud andmed",
                        messageBackground: "variant-filled-error"
                  };
            try {
                  await prisma.category.delete({
                        where: {
                              id: parseInt(category)
                        }
                  });
                  return {
                        message: `Kategooria kustutatud!`,
                        messageBackground: "variant-filled-primary"
                  };
            } catch (error) {
                  console.error(error);
                  return {
                        message: "Midagi läks valesti",
                        messageBackground: "variant-filled-error"
                  };
            }
      },
}