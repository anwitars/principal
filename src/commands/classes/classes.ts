import { SlashCommandBuilder } from "discord.js";
import { PrincipalCommandDescriptor, PrincipalCommandExecutor } from "../../commands";
import { commandDescriptorClassesCreate } from "./create";
import { commandDescriptorClassesList } from "./list";
import { commandDescriptorClassesList_All } from "./list-all";
import { commandDescriptorClassesDelete } from "./delete";

const subcommands = {
  create: commandDescriptorClassesCreate,
  list: commandDescriptorClassesList,
  "list-all": commandDescriptorClassesList_All,
  delete: commandDescriptorClassesDelete,
} as const;

type SubcommandName = keyof typeof subcommands;

const slashCommand = new SlashCommandBuilder()
  .setName("classes")
  .setDescription("Commands related to classes.")
  .addSubcommand(subcommands["create"].subcommandBuilder)
  .addSubcommand(subcommands["list"].subcommandBuilder)
  .addSubcommand(subcommands["list-all"].subcommandBuilder)
  .addSubcommand(subcommands["delete"].subcommandBuilder);

const execute: PrincipalCommandExecutor = async (interaction) => {
  const subcommand = interaction.options.getSubcommand() as SubcommandName;

  await subcommands[subcommand].execute(interaction);
};

export const commandDescriptorClasses: PrincipalCommandDescriptor = {
  slashCommandBuilder: slashCommand,
  execute,
};
