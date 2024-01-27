import { LogLevel } from "../src/types.ts";
import * as sinon from "sinon";
import "chai-sinon";
import { Logger } from "../src/logger/logger.ts";

describe("Logger", () => {
  it("log level hierarchy", async () => {
    const consoleSpy = sinon.spy(console, "log");
    const logger = new Logger(LogLevel.Warning);

    logger.debug("debug message");
    sinon.assert.notCalled(consoleSpy);

    logger.info("info message");
    sinon.assert.notCalled(consoleSpy);

    logger.warning("warn message");
    sinon.assert.calledOnce(consoleSpy);

    logger.error("error message");
    sinon.assert.calledTwice(consoleSpy);

    consoleSpy.restore();
  });
});
