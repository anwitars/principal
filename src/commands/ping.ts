import { SlashCommandBuilder } from "discord.js";
import { PrincipalCommandDescriptor, PrincipalCommandExecutor } from "../commands";

const slashCommandBuilderPing = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

const resolvePing: PrincipalCommandExecutor = async (interaction) => {
    await interaction.reply({
        content: "Pong!",
        ephemeral: true,
    });
};

export const commandDescriptorPing: PrincipalCommandDescriptor = {
    slashCommandBuilder: slashCommandBuilderPing,
    execute: resolvePing,
};
