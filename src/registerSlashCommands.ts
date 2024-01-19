import { REST, Routes } from "discord.js";
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from "./environment";
import { getSlashCommands } from "./commands";

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

export const registerSlashCommands = async () => {
  console.log("Started refreshing application (/) commands.");

  try {
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: getSlashCommands(),
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
