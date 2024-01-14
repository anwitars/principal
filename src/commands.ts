import { ChatInputCommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody as SlashCommandJSON, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { commandDescriptorPing } from "./commands/ping";

const commands = {
    "ping": commandDescriptorPing,
}

export type PrincipalCommandName = keyof typeof commands;
export type PrincipalCommandExecutor = (interaction: ChatInputCommandInteraction) => Promise<void>;
export type PrincipalSubcommandBuilder = (subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder;

export type PrincipalCommandDescriptor = {
    readonly slashCommandBuilder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
    readonly execute: PrincipalCommandExecutor;
};
export type PrincipalSubcommandCommandDescriptor = {
    readonly subcommandBuilder: PrincipalSubcommandBuilder;
    readonly execute: PrincipalCommandExecutor;
};

export const getSlashCommands = (): SlashCommandJSON[] =>
    Object.values(commands).map((command) => command.slashCommandBuilder.toJSON());

export const getPrincipalCommand = (
    commandName: PrincipalCommandName
): PrincipalCommandDescriptor => commands[commandName];

export const runPrincipalCommand = async (
    commandName: PrincipalCommandName,
    interaction: ChatInputCommandInteraction
): Promise<void> => await getPrincipalCommand(commandName).execute(interaction);
