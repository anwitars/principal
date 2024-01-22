import { MongoClient } from "mongodb";
import { Database } from "./db";
import { PRINCIPAL_MONGO_URI } from "../environment";

const client = new MongoClient(PRINCIPAL_MONGO_URI);
await client.connect();
const db = new Database(client);

export default db;
