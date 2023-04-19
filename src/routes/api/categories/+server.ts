import { categories } from "../../../db/categories";
import type { CategoryModel } from "src/types/category";

export async function GET({ url }: any) {

      const data: CategoryModel[] = (await categories
            .find({})
            .toArray()) as CategoryModel[];
      return new Response(JSON.stringify({ categories: data }));
 
}