import { PrincipalCommandExecutor, PrincipalSubcommandGroupBuilder } from "../../commands";
import db, { ServerSetting } from "../../database/db";

const subcommandGroupBuilder: PrincipalSubcommandGroupBuilder = (group) =>
  group
    .setName("get")
    .setDescription("Get a setting for Principal on this server")
    .addSubcommand((subcommand) =>
      subcommand.setName("enabled").setDescription("Whether Principal is enabled on this server"),
    );

const execute: PrincipalCommandExecutor = async (interaction) => {
  const subcommandName = interaction.options.getSubcommand(true) as ServerSetting;

  await interaction.reply({
    content: `Getting setting ${subcommandName}...`,
    ephemeral: true,
  });

  const value = await db.getServerSetting(subcommandName, interaction.guildId!);

  await interaction.editReply(`Setting ${subcommandName} is ${value}`);
};

export const commandDescriptorSettingsGet = {
  subcommandGroupBuilder,
  execute,
};
