import db from "./mongo";

export const items = db.collection("Items");
