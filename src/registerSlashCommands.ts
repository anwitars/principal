import { REST, Routes } from "discord.js";
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from "./environment";
import { getSlashCommands } from "./commands";
import logger from "./logger";

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

export const registerSlashCommands = async () => {
  logger.info("Started refreshing application (/) commands.");

  try {
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: getSlashCommands(),
    });
    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error("Failed to reload application (/) commands.");
  }
};
