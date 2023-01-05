import { orders } from "../../../db/orders";
import type { OrderModel } from "src/types/order";
import XLSX from "xlsx";
import { appendFile } from "fs/promises";
import type { client } from "../orders/+server";

const workSheetColumnName = [
	"ID",
	"Nimi",
	"Telefoni number",
	"Tellitud tooted",
	"Pakitud",
	"Pakikaart",
	"Saadetud"
];
const workSheetName = "Tellimused";

export async function GET({ url }: any) {
	const query = await url.searchParams;
	const orderData: any[] = [];
	const current_date = new Date().getTime();

	if (query.get("packed") == "true") {
		const data = (await orders
			.find({
				"status.packed": true,
				"status.shipment_card": false,
				"status.sent": false
			})
			.toArray()) as OrderModel[];
		if (data.length != 0) {
			data.forEach((order: OrderModel) => {
				orderData.push({
					internal_id: order.internal_id,
					client_name: order.client_name,
					client_nr: order.client_nr,
					ordered_items: order.ordered_items,
					packed: order.status.packed,
					shipment_card: order.status.shipment_card,
					sent: order.status.sent
				});
			});
		}
	}
	if (query.get("sent") == "true") {
		const data = (await orders.find({ "status.sent": true }).toArray()) as OrderModel[];
		if (data.length != 0) {
			data.forEach((order: OrderModel) => {
				orderData.push({
					internal_id: order.internal_id,
					client_name: order.client_name,
					client_nr: order.client_nr,
					ordered_items: order.ordered_items,
					packed: order.status.packed,
					shipment_card: order.status.shipment_card,
					sent: order.status.sent
				});
			});
		}
	}
	if (query.get("unsent") == "true") {
		const data = (await orders
			.find({
				"status.packed": true,
				"status.shipment_card": true,
				"status.sent": false
			})
			.toArray()) as OrderModel[];
		if (data.length != 0) {
			data.forEach((order: OrderModel) => {
				orderData.push({
					internal_id: order.internal_id,
					client_name: order.client_name,
					client_nr: order.client_nr,
					ordered_items: order.ordered_items,
					packed: order.status.packed,
					shipment_card: order.status.shipment_card,
					sent: order.status.sent
				});
			});
		}
	}
	if (query.get("unpacked") == "true") {
		const data = (await orders.find({ "status.packed": false }).toArray()) as OrderModel[];
		if (data.length != 0) {
			data.forEach((order: OrderModel) => {
				orderData.push({
					internal_id: order.internal_id,
					client_name: order.client_name,
					client_nr: order.client_nr,
					ordered_items: order.ordered_items,
					packed: order.status.packed,
					shipment_card: order.status.shipment_card,
					sent: order.status.sent
				});
			});
		}
	}

	const data = orderData.map((order: any) => {
		if (order.packed == true) {
			order.packed = "Jah";
		} else {
			order.packed = "Ei";
		}
		if (order.shipment_card == true) {
			order.shipment_card = "Jah";
		} else {
			order.shipment_card = "Ei";
		}
		if (order.sent == true) {
			order.sent = "Jah";
		} else {
			order.sent = "Ei";
		}
		return [
			order.internal_id,
			order.client_name,
			order.client_nr,
			order.ordered_items.join(),
			order.packed,
			order.shipment_card,
			order.sent
		];
	});
	const workBook = XLSX.utils.book_new();
	const workSheetData = [workSheetColumnName, ...data];

	const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
	XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
	XLSX.writeFile(workBook, `./public/sheets/${current_date}_tellimused.xlsx`);

	return new Response(JSON.stringify({ filename: `${current_date}_tellimused.xlsx` }));
}

export async function POST({ request }: any) {
	const body: FormData = await request.formData();
	const file = body.get("uploadedFile") as File;

	await appendFile(
		`./public/sheets/upload_${file.name}`,
		(
			await file.stream().getReader().read()
		).value as Uint8Array
	);
	const workbook = XLSX.readFile(`./public/sheets/upload_${file.name}`);

	let sheet_name_list = workbook.SheetNames;
	const orders_sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
	for (let i = 0; i < orders_sheet.length; i++) {
		const order: any = orders_sheet[i];
		const created_at = new Date();
		const ordered_items = order["Tellitud Tooted"].split(",");
		const client_name = order["Nimi"];
		const client_nr = order["Telefoni Number"];
		let packed = false;
		let shipment_card = false;
		let sent = false;
		let at_store = false;
		if (order["Pakitud"] == "Jah") {
			packed = true;
		}
		if (order["Pakikaart"] == "Jah") {
			shipment_card = true;
		}
		if (order["Saadetud"] == "Jah") {
			sent = true;
		}
		if (order["Poest"] == "Jah") {
			at_store = true;
		}
		const latest = (await orders
			.find({})
			.sort({ internal_id: -1 })
			.limit(1)
			.toArray()) as client[];
		let internal_id: number = 1;
		if (latest.length != 0) {
			internal_id = latest[0].internal_id + 1;
		}

		await orders.insertOne({
			client_name: client_name,
			client_nr: client_nr,
			internal_id: internal_id,
			ordered_items: ordered_items,
			status: {
				packed: packed,
				sent: sent,
				shipment_card: shipment_card,
				at_store: at_store
			},
			updated_at: created_at,
			created_at: created_at
		});
	}

	return new Response(JSON.stringify({ Inserted: "true" }));
}
