import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from "./environment";
import { registerSlashCommands } from "./registerSlashCommands";
import { PrincipalCommandName, getPrincipalCommand } from "./commands";

const client = new Client({
    intents: [GatewayIntentBits.MessageContent]
});

client.once("ready", async (readyClient) => {
    console.log(`Principal is ready! Logged in as ${readyClient.user.tag}`);
    await registerSlashCommands();
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const runCommand = async (commandName: PrincipalCommandName) => {
        const command = getPrincipalCommand(commandName);
        await command.execute(interaction);
    }

    switch (interaction.commandName as PrincipalCommandName) {
        case "ping":
            await runCommand("ping");
            break;
    }
});

client.login(DISCORD_TOKEN);
