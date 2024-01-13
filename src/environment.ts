export const ENV_PREFIX = "PRINCIPAL" as const;

const withPrefix = (key: string): string => `${ENV_PREFIX}_${key}`;

const getEnv = (key: string): string => {
    key = withPrefix(key);
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environmental variable ${key} is not set`);
    }
    return value;
}

export const DISCORD_TOKEN = getEnv("DISCORD_TOKEN");
export const DISCORD_CLIENT_ID = getEnv("DISCORD_CLIENT_ID");
