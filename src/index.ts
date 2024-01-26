import { Client } from "discord.js";
import { DISCORD_TOKEN } from "./environment";
import { registerSlashCommands } from "./registerSlashCommands";
import { PrincipalCommandName, runPrincipalCommand } from "./commands";
import db from "./database/instance";
import logger from "./logger/instance";

const discord_client = new Client({
  intents: [],
});

discord_client.once("ready", async (readyClient) => {
  logger.info(`Principal is ready! Logged in as ${readyClient.user.tag}`);
  await registerSlashCommands();
});

discord_client.on("interactionCreate", async (interaction) => {
  // We are only interested in slash commands
  if (!interaction.isChatInputCommand()) return;

  // The bot can only be used on servers
  const serverId = interaction.guildId;
  if (!serverId) {
    await interaction.reply({
      content: "Principal can only be used in a server!",
      ephemeral: true,
    });
    return;
  }

  logger.debug(`Received interaction '${interaction.commandName}' from ${interaction.user.tag}`);

  const commandName = interaction.commandName as PrincipalCommandName;

  if (commandName !== "settings") {
    const isBotEnabled = (await db.getServerSetting("enabled", serverId)) ?? true;
    if (!isBotEnabled) {
      await interaction.reply({
        content: "Principal is disabled on this server.",
        ephemeral: true,
      });
      return;
    }
  }

  await runPrincipalCommand(commandName, interaction);
});

discord_client.login(DISCORD_TOKEN);
