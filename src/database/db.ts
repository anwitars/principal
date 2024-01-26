import * as mongodb from "mongodb";
import { ClassModelInput, ClassModel } from "./models";

/** An unrestricted object to be used as a query for MongoDB */
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

/** A class to handle all database operations */
export class Database {
  private db: mongodb.Db;

  constructor(client: mongodb.MongoClient) {
    this.db = client.db();
  }

  /** Set a specific setting for a server
   * @param key The setting to set
   * @param value The value to set the setting to
   * @param serverId The ID of the server to set the setting for
   * @returns A promise that resolves when the setting has been set
   * */
  public async setServerSetting<T extends ServerSetting>(
    key: T,
    value: ServerSettingValues[T],
    serverId: string,
  ): Promise<void> {
    await this.db.collection("settings").updateOne({ type: key, serverId }, { $set: { value } }, { upsert: true });
  }

  /** Get a specific setting for a server
   * @param key The setting to get
   * @param serverId The ID of the server to get the setting for
   * @returns A promise that resolves with the value of the setting or undefined if the setting is not set
   * */
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

  /** Create a new class for the given options
   * @param classInput The options for the class
   * @returns A promise that resolves with the ID of the created class
   * */
  public async createClass(classInput: ClassModelInput): Promise<mongodb.BSON.ObjectId> {
    const { className, datetime, studentId, serverId } = classInput;
    const result = await this.db
      .collection<ClassModelInput>("classes")
      .insertOne({ className, datetime, studentId, serverId });
    return result.insertedId;
  }

  /** Get all classes for a given server
   * @param serverId The ID of the server to get the classes for
   * @param options Options to filter the classes by
   * @returns A promise that resolves with an array of classes
   * */
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

  /** Delete a class for a given filter
   * @param filter The filter to delete the class by
   * @returns A promise that resolves with a boolean indicating whether the class was deleted
   * */
  public async deleteClass(filter: Partial<ClassModel>): Promise<boolean> {
    const result = await this.db.collection("classes").deleteOne(filter);
    return result.deletedCount === 1;
  }
}
