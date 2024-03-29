import { LogLevel } from "./types";
import { logLevelFromString } from "./utils";
import * as fs from "fs";

export const ENV_PREFIX = "PRINCIPAL" as const;

const withPrefix = (key: string): string => `${ENV_PREFIX}_${key}`;

function getEnv(key: string): string;
function getEnv<T>(key: string, mapper: (envValue: string) => T, orDefault?: T | undefined): T;
function getEnv(key: string, mapper: undefined, orDefault: string): string;

/**
 * Gets an environmental variable with the given key, optionally mapping it to a different type and
 * returning a default value if it is not set. */
function getEnv<T>(
  key: string,
  mapper?: ((envValue: string) => T) | undefined,
  orDefault?: T | string | undefined,
): T | string {
  key = withPrefix(key);
  const envValue = process.env[key];

  if (envValue) {
    if (mapper) {
      return mapper(envValue);
    } else {
      return envValue;
    }
  } else if (orDefault) {
    return orDefault;
  }

  throw new Error(`Environmental variable ${key} is not set`);
}

const loadVersion = (): string | undefined => {
  try {
    const packagejson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    return `v${packagejson.version}`;
  } catch (error) {
    return undefined;
  }
};

export const DISCORD_TOKEN = getEnv("DISCORD_TOKEN");
export const DISCORD_CLIENT_ID = getEnv("DISCORD_CLIENT_ID");
export const PRINCIPAL_MONGO_URI = getEnv("MONGO_URI");
export const LOG_LEVEL = getEnv("LOG_LEVEL", logLevelFromString, LogLevel.Warning);
export const APPLICATION_VERSION = loadVersion();
