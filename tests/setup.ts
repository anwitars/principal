import type { setupProcess, setupGlobal } from "./global.d";
import { register } from "ts-node";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { Database } from "../src/database/db";

declare let global: typeof setupGlobal;
declare let process: typeof setupProcess;

register({
  project: "tests/tsconfig.json",
});

export async function mochaGlobalSetup(): Promise<void> {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();

  global.mongodbInstance = instance;
  process.env.PRINCIPAL_MONGO_URI = uri;

  const client = new MongoClient(uri);
  await client.connect();

  global.mongoClient = client;
  global.database = new Database(client);
}
