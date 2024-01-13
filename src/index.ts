import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from "./environment";
import { registerSlashCommands } from "./registerSlashCommands";

const client = new Client({
    intents: [GatewayIntentBits.MessageContent]
});

client.once("ready", async (readyClient) => {
    console.log(`Principal is ready! Logged in as ${readyClient.user.tag}`);
    await registerSlashCommands();
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case "ping":
            await interaction.reply("Pong!");
            break;
    }
});

client.login(DISCORD_TOKEN);
