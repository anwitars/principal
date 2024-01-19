import { LogLevel } from "./types";

export const logLevelFromString = (level: string): LogLevel => {
  level = level.toLowerCase();
  switch (level) {
    case "debug":
      return LogLevel.Debug;
    case "info":
      return LogLevel.Info;
    case "warning":
      return LogLevel.Warning;
    case "error":
      return LogLevel.Error;
    default:
      throw new Error(`Unknown log level: ${level}`);
  }
};
