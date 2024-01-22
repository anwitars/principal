import * as mongodb from "mongodb";
import { PRINCIPAL_MONGO_URI } from "../environment";
import logger from "../logger";
import { ClassInputModel, ClassModel } from "./models";

type Query = {
  [key: string]: unknown;
};

export type ServerSettingValues = {
  enabled: boolean;
};

export type ServerSetting = keyof ServerSettingValues;

export type GetClassesOptions = {
  userId?: string;
  filter?: mongodb.Filter<ClassModel>;
};

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

  public async createClass(classInput: ClassInputModel): Promise<mongodb.BSON.ObjectId> {
    const { className, datetime, studentId, serverId } = classInput;
    const result = await this.db
      .collection<ClassInputModel>("classes")
      .insertOne({ className, datetime, studentId, serverId });
    return result.insertedId;
  }

  public async getClasses(serverId: string, options?: GetClassesOptions): Promise<ClassModel[]> {
    const query: Query = { serverId };

    if (options?.userId) {
      query["userId"] = options.userId;
    }

    if (options?.filter) {
      Object.assign(query, options.filter);
    }

    const result = await this.db.collection("classes").find<ClassModel>(query).toArray();
    return result;
  }
}

const db = new Database();
await db.init();

export default db;
