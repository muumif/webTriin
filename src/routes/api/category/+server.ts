import type { RequestEvent } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export async function GET({request}: RequestEvent) {
      const categories = await prisma.category.findMany();
      return new Response(JSON.stringify({ categories }), { status: 200 });
}

export async function POST({ request }: RequestEvent) {
	const body = await request.json();
	const { name } = body;

      if (!name)
            return new Response(JSON.stringify({ message: "Invalid data" }), { status: 400 });

      if (typeof name == "object") {
            try {
                  await prisma.category.createMany({
                        data: name.map((n: string) => ({
                              name: n,
                        }))
                  });
                  const categories = await prisma.category.findMany();
                  return new Response(JSON.stringify({ message: `Categories created successfully!`, categories}), {status: 200})
            } catch(error: any) {
                  return new Response(JSON.stringify({ message: error.message }), { status: 400 });
            }
      }
      if (typeof name == "string") {
            if (name == "deleteall") {
                  try {
                        await prisma.category.deleteMany();
                        return new Response(JSON.stringify({ message: `Categories deleted successfully!`}), {status: 200})
                  } catch(error: any) {
                        return new Response(JSON.stringify({ message: error.message }), { status: 400 });
                  }
            }
            try {
                  const category = await prisma.category.create({
                        data: {
                              name: name,
                        }
                  })
                  const categories = await prisma.category.findMany();
                  return new Response(JSON.stringify({ message: `Category ${category.name} created successfully!`, categories}), {status: 200})
            } catch(error: any) {
                  return new Response(JSON.stringify({ message: error.message }), { status: 400 });
            }
      }


}