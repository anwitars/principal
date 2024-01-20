import * as mongodb from "mongodb";
import { PRINCIPAL_MONGO_URI } from "../environment";
import logger from "../logger";

export type ServerSettingValues = {
  enabled: boolean;
};

export type ServerSetting = keyof ServerSettingValues;

export class Database {
  private db!: mongodb.Db;

  public async init() {
    logger.info("Connecting to Mongo database...");
    const client = await mongodb.MongoClient.connect(PRINCIPAL_MONGO_URI);
    this.db = client.db();
    logger.info("Connected to Mongo database!");
  }

  public async setServerSetting<T extends ServerSetting>(key: T, value: ServerSettingValues[T], serverId: string) {
    await this.db.collection("settings").updateOne({ type: key, serverId }, { $set: { value } }, { upsert: true });
  }

  public async getServerSetting<T extends ServerSetting>(
    key: T,
    serverId: string,
  ): Promise<ServerSettingValues[T] | undefined> {
    if (!serverId) {
      return undefined;
    }

    const result = await this.db.collection("settings").findOne({ type: key, serverId });

    if (!result) {
      return undefined;
    }

    return result.value;
  }
}

const db = new Database();
await db.init();

export default db;
