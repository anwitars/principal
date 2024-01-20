import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { PrincipalCommandExecutor, PrincipalSubcommandGroupBuilder } from "../../commands";
import db, { ServerSetting, ServerSettingValues } from "../../database/db";

const enabledSubcommand = new SlashCommandSubcommandBuilder()
  .setName("enabled")
  .setDescription("Whether Principal is enabled on this server")
  .addBooleanOption((option) =>
    option.setName("enabled").setDescription("Whether Principal is enabled on this server").setRequired(true),
  );

const subcommandGroupBuilder: PrincipalSubcommandGroupBuilder = (group) =>
  group.setName("set").setDescription("Set a setting for Principal on this server").addSubcommand(enabledSubcommand);

const getSettingValue = <K extends ServerSetting>(
  interaction: ChatInputCommandInteraction,
  settingName: K,
): ServerSettingValues[K] => {
  switch (settingName) {
    case "enabled":
      return interaction.options.getBoolean("enabled", true) as ServerSettingValues[K];
  }

  throw new Error(`Unreachable: ${settingName}`);
};

const formatResponseValue = <K extends ServerSetting>(settingName: K, value: ServerSettingValues[K]): string => {
  switch (settingName) {
    case "enabled":
      return value ? "enabled" : "disabled";
  }

  throw new Error(`Unreachable: ${settingName}`);
};

const execute: PrincipalCommandExecutor = async (interaction) => {
  const subcommandName = interaction.options.getSubcommand(true) as ServerSetting;

  await interaction.reply({
    content: `Changing setting ${subcommandName}...`,
    ephemeral: true,
  });

  const value = getSettingValue(interaction, subcommandName);

  await db.setServerSetting(subcommandName, value, interaction.guildId!);

  const formattedValue = formatResponseValue(subcommandName, value);

  await interaction.editReply(`Changed setting ${subcommandName} to ${formattedValue}`);
};

export const commandDescriptorSettingsSet = {
  subcommandGroupBuilder,
  execute,
};
