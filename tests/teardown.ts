import type { setupGlobal } from "./global.d";

declare const global: typeof setupGlobal;

export const mochaGlobalTeardown = async () => {
  global.mongoClient.close();
  global.mongodbInstance.stop();
};
