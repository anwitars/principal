export declare let setupGlobal: NodeJS.Global &
  typeof globalThis & {
    mongodbInstance: import("mongodb-memory-server").MongoMemoryServer;
    mongoClient: import("mongodb").MongoClient;
    database: import("../src/database/db").Database;
  };

export declare let setupProcess: NodeJS.Process & {
  env: {
    PRINCIPAL_MONGO_URI: string;
  };
};
