import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from "./environment";
import { registerSlashCommands } from "./registerSlashCommands";
import { PrincipalCommandName, runPrincipalCommand } from "./commands";
import logger from "./logger";

const client = new Client({
  intents: [GatewayIntentBits.MessageContent],
});

client.once("ready", async (readyClient) => {
  logger.info(`Principal is ready! Logged in as ${readyClient.user.tag}`);
  await registerSlashCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  logger.debug(`Received interaction for command ${interaction.commandName} from ${interaction.user.tag}`);

  const commandName = interaction.commandName as PrincipalCommandName;
  await runPrincipalCommand(commandName, interaction);
});

client.login(DISCORD_TOKEN);
