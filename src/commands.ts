import { ChatInputCommandInteraction } from "discord.js";

const commands = {
    "ping": {
        description: "Ping!" as const,
        execute: async (interaction: ChatInputCommandInteraction) => {
            await interaction.reply("Pong!");
        }
    }
}

export type PrincipalCommandName = keyof typeof commands;
export type PrincipalCommandDescription = typeof commands[PrincipalCommandName]["description"];

export type SlashCommandDescriptor = {
    readonly name: PrincipalCommandName;
    readonly description: PrincipalCommandDescription;
};

export type PrincipalCommandExecutor = (interaction: ChatInputCommandInteraction) => Promise<void>;

export type PrincipalCommandDescriptor = {
    readonly description: PrincipalCommandDescription;
    readonly execute: PrincipalCommandExecutor;
};

export const getSlashCommands = (): SlashCommandDescriptor[] =>
    Object.entries(commands).map(([name, command]) => ({
        name: name as PrincipalCommandName,
        description: command.description,
    }));

export const getPrincipalCommand = (commandName: PrincipalCommandName): PrincipalCommandDescriptor => commands[commandName];
