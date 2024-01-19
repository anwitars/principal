import { LogLevel } from "./types";
import { logLevelFromString } from "./utils";

export const ENV_PREFIX = "PRINCIPAL" as const;

const withPrefix = (key: string): string => `${ENV_PREFIX}_${key}`;

function getEnv(key: string): string;
function getEnv<T>(key: string, mapper: (envValue: string) => T, orDefault?: T | undefined): T;
function getEnv(key: string, mapper: undefined, orDefault: string): string;

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

export const DISCORD_TOKEN = getEnv("DISCORD_TOKEN");
export const DISCORD_CLIENT_ID = getEnv("DISCORD_CLIENT_ID");
export const PRINCIPAL_MONGO_URI = getEnv("MONGO_URI");
export const LOG_LEVEL = getEnv("LOG_LEVEL", logLevelFromString, LogLevel.Warning);
