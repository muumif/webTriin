import db from "./mongo";

export const categories = db.collection("Categories");
