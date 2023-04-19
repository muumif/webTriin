import type { ItemModel } from "src/types/items";
import { items } from "../../db/items";
import type { PageServerLoad } from "./$types";
import { categories } from "../../db/categories";
import type { CategoryModel } from "src/types/category";

export const load: PageServerLoad = async function () {
	const data = (await items.find({}).toArray()) as ItemModel[];
	const category_data = (await categories.find({}).toArray()) as CategoryModel[];
	
	const itemData: any[] = [];
	const categoryData: any[] = [];
	data.forEach((order) => {
		itemData.push({
                  item_category: order.item_category,
                  item_name: order.item_name,
                  price: order.price,
                  item_id: order.item_id,
			amount: order.amount,
			ordered: order.ordered,
		});
	});
	category_data.forEach((category) => {
		categoryData.push({
			name: category.name,
			value: category.value,
		});
	});

	return {
		items: itemData,
		categories: categoryData,
	};
};
