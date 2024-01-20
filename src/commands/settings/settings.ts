import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { PrincipalCommandExecutor } from "../../commands";
import { commandDescriptorSettingsGet } from "./get";
import { commandDescriptorSettingsSet } from "./set";

const subcommands = {
  get: commandDescriptorSettingsGet,
  set: commandDescriptorSettingsSet,
};

type SubcommandGroupName = keyof typeof subcommands;

const slashCommand = new SlashCommandBuilder()
  .setName("settings")
  .setDescription("Change settings for Principal on this server")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommandGroup(subcommands["get"].subcommandGroupBuilder)
  .addSubcommandGroup(subcommands["set"].subcommandGroupBuilder);

const execute: PrincipalCommandExecutor = async (interaction) => {
  const subcommandName = interaction.options.getSubcommandGroup(true) as SubcommandGroupName;
  await subcommands[subcommandName].execute(interaction);
};

export const commandDescriptorSettings = {
  slashCommandBuilder: slashCommand,
  execute,
};
