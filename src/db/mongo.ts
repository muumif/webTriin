import { MongoClient } from "mongodb";
import { env } from '$env/dynamic/private'


const client = new MongoClient(env.MONGO_CLIENT_STRING as string);

export function start_mongo() {
	console.log("Starting mongo...");
	return client.connect();
}

export default client.db("Triin");
