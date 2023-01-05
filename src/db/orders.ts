import db from "./mongo";

export const orders = db.collection("Orders");
