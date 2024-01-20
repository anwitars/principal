import { SlashCommandBuilder } from "discord.js";
import { PrincipalCommandDescriptor, PrincipalCommandExecutor } from "../../commands";
import { commandDescriptorClassesCreate } from "./create";
import { commandDescriptorClassesList } from "./list";

const subcommands = {
  create: commandDescriptorClassesCreate,
  list: commandDescriptorClassesList,
} as const;

type SubcommandName = keyof typeof subcommands;

const slashCommand = new SlashCommandBuilder()
  .setName("classes")
  .setDescription("Commands related to classes.")
  .addSubcommand(subcommands["create"].subcommandBuilder)
  .addSubcommand(subcommands["list"].subcommandBuilder);

const execute: PrincipalCommandExecutor = async (interaction) => {
  const subcommand = interaction.options.getSubcommand() as SubcommandName;

  await subcommands[subcommand].execute(interaction);
};

export const commandDescriptorClasses: PrincipalCommandDescriptor = {
  slashCommandBuilder: slashCommand,
  execute,
};
