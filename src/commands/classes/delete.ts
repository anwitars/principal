import {
  PrincipalCommandExecutor,
  PrincipalSubcommandBuilder,
  PrincipalSubcommandCommandDescriptor,
} from "../../commands";
import db from "../../database/instance";
import { INVALID_DATETIME_FORMAT } from "../constants";
import { isUserAdmin, replyWithNotEnoughPermissions } from "../utils";

const subcommandBuilder: PrincipalSubcommandBuilder = (subcommand) =>
  subcommand
    .setName("delete")
    .setDescription("Delete a class")
    .addUserOption((option) =>
      option.setName("student").setDescription("The student the class belongs to").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("datetime")
        .setDescription("The date and time of the class.")
        .setRequired(true)
        .setMinLength(16)
        .setMaxLength(16),
    );

const execute: PrincipalCommandExecutor = async (interaction) => {
  const isAdmin = await isUserAdmin(interaction);
  if (!isAdmin) {
    await replyWithNotEnoughPermissions(interaction);
    return;
  }

  await interaction.deferReply({
    ephemeral: true,
  });

  const student = interaction.options.getUser("student", true);
  const datetimeOption = interaction.options.getString("datetime", true);
  const datetime = new Date(datetimeOption);

  if (isNaN(datetime.getTime())) {
    await interaction.editReply(INVALID_DATETIME_FORMAT);
    return;
  }

  const deleteResult = await db.deleteClass({
    studentId: student.id,
    datetime,
    serverId: interaction.guildId!,
  });

  if (!deleteResult) {
    await interaction.editReply("Class not found.");
    return;
  }

  const sendMessageResult = await student.send({
    embeds: [
      {
        title: "Class deleted",
        description: `Your class on \`${datetime.toLocaleString("hu-HU")}\` has been deleted.`,
      },
    ],
  });

  await interaction.editReply(
    `Class deleted. Direct message has been ${sendMessageResult ? "sent" : "not sent due to an error"}.`,
  );
};

export const commandDescriptorClassesDelete: PrincipalSubcommandCommandDescriptor = {
  subcommandBuilder,
  execute,
};
