import type { CategoryModel } from "src/types/category";
import type { ItemModel } from "src/types/items";
import { writable } from "svelte/store";

export const items = writable<ItemModel[]>([]);
export const category = writable<CategoryModel[]>();