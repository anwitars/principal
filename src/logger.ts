import { LOG_LEVEL } from "./environment";
import { LogLevel } from "./types";

enum Color {
  Reset = "\x1b[0m",
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Blue = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan = "\x1b[36m",
  White = "\x1b[37m",
  Gray = "\x1b[90m",
}

const withColor = (color: Color, message: string) => {
  return `${color}${message}${Color.Reset}`;
};

const associateColor = (level: LogLevel) => {
  switch (level) {
    case LogLevel.Debug:
      return Color.Gray;
    case LogLevel.Info:
      return Color.Green;
    case LogLevel.Warning:
      return Color.Yellow;
    case LogLevel.Error:
      return Color.Red;
  }
};

export class Logger {
  level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = withColor(Color.Cyan, new Date().toISOString());
    const levelString = withColor(associateColor(level), LogLevel[level].toUpperCase());
    const coloredMessage = withColor(associateColor(level), message);
    return `${timestamp} | [${levelString}] ${coloredMessage}`;
  }

  log(level: LogLevel, message: string): void {
    if (level < this.level) {
      return;
    }
    console.log(this.formatMessage(level, message));
  }

  debug(message: string): void {
    this.log(LogLevel.Debug, message);
  }

  info(message: string): void {
    this.log(LogLevel.Info, message);
  }

  warning(message: string): void {
    this.log(LogLevel.Warning, message);
  }

  error(error: Error): void;
  error(message: string, error?: Error): void;
  error(message: string | Error, error?: Error): void {
    if (message instanceof Error) {
      error = message;
      message = error.message;
    }
    this.log(LogLevel.Error, `${message}\n${error?.stack}`);
  }
}

const logger = new Logger(LOG_LEVEL);
export default logger;
