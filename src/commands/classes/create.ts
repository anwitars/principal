import {
  PrincipalCommandExecutor,
  PrincipalSubcommandBuilder,
  PrincipalSubcommandCommandDescriptor,
} from "../../commands";
import db from "../../database/instance";
import { PrincipalTime } from "../../time";
import { INVALID_DATETIME_FORMAT } from "../constants";
import { isUserAdmin, replyWithNotEnoughPermissions } from "../utils";

const subcommandBuilder: PrincipalSubcommandBuilder = (subcommand) =>
  subcommand
    .setName("create")
    .setDescription("Create a class.")
    .addUserOption((option) =>
      option.setName("student").setDescription("The student to create the class for.").setRequired(true),
    )
    .addStringOption((option) => option.setName("name").setDescription("The name of the class.").setRequired(true))
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

  await interaction.reply({
    content: "Creating class...",
    ephemeral: true,
  });

  const student = interaction.options.getUser("student", true);
  const className = interaction.options.getString("name", true);
  const datetimeOption = interaction.options.getString("datetime", true);
  const datetime = new PrincipalTime(new Date(datetimeOption));

  if (isNaN(datetime.date.getTime())) {
    await interaction.editReply(INVALID_DATETIME_FORMAT);
    return;
  }

  if (datetime.date < new Date()) {
    await interaction.editReply("Date and time must be in the future.");
    return;
  }

  await db.createClass({ className, datetime: datetime.date, studentId: student.id, serverId: interaction.guildId! });

  const result = await student.send({
    embeds: [
      {
        title: "Reminder for class",
        description:
          "This is a one time reminder for this class. To see all your classes, use `/classes list` on the server's bot commands channel.",
        fields: [
          {
            name: "Student",
            value: student.toString(),
          },
          {
            name: "Class name",
            value: className,
          },
          {
            name: "Date and time",
            value: datetime.toString(),
          },
        ],
      },
    ],
  });

  const directMessageResult = result ? "" : "\nFailed to send message to student.";
  const replyResult = `Class ${className} created for student ${student.toString()} at ${datetime.toString()}`.concat(
    directMessageResult,
  );

  await interaction.editReply(replyResult);
};

export const commandDescriptorClassesCreate: PrincipalSubcommandCommandDescriptor = {
  subcommandBuilder,
  execute,
};
