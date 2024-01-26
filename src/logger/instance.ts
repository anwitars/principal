import { LOG_LEVEL } from "../environment";
import { Logger } from "./logger";

const logger = new Logger(LOG_LEVEL);
export default logger;
