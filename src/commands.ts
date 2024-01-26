import {
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody as SlashCommandJSON,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { commandDescriptorPing } from "./commands/ping";
import { commandDescriptorClasses } from "./commands/classes/classes";
import { commandDescriptorSettings } from "./commands/settings/settings";

/** All the root commands that can be used by the bot. They also contain all the subcommands. */
const commands = {
  ping: commandDescriptorPing,
  classes: commandDescriptorClasses,
  settings: commandDescriptorSettings,
};

/** Root command names that can be used by the bot. */
export type PrincipalCommandName = keyof typeof commands;

/** Function signature that processes a slash command. */
export type PrincipalCommandExecutor = (interaction: ChatInputCommandInteraction) => Promise<void>;

/** Function signature that either processes or builds a slash subcommand. */
export type PrincipalSubcommandBuilder = (subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder;

/** Function signature that either processes or builds a group of slash subcommands. */
export type PrincipalSubcommandGroupBuilder = (
  subcommand: SlashCommandSubcommandGroupBuilder,
) => SlashCommandSubcommandGroupBuilder;

/**
 * Describes a standardized command for the bot.
 * */
export type PrincipalCommandDescriptor = {
  readonly slashCommandBuilder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  readonly execute: PrincipalCommandExecutor;
};

/**
 * Describes a standardized subcommand for the bot.
 * */
export type PrincipalSubcommandCommandDescriptor = {
  readonly subcommandBuilder: PrincipalSubcommandBuilder;
  readonly execute: PrincipalCommandExecutor;
};

/** Formats the slash commands into a JSON format that can be sent to Discord. */
export const getSlashCommands = (): SlashCommandJSON[] =>
  Object.values(commands).map((command) => command.slashCommandBuilder.toJSON());

/** Runs a principal command. */
export const runPrincipalCommand = async (
  commandName: PrincipalCommandName,
  interaction: ChatInputCommandInteraction,
): Promise<void> => await commands[commandName].execute(interaction);
