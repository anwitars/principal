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
  const datetime = new Date(datetimeOption);

  if (isNaN(datetime.getTime())) {
    await interaction.editReply(INVALID_DATETIME_FORMAT);
    return;
  }

  if (datetime < new Date()) {
    await interaction.editReply("Date and time must be in the future.");
    return;
  }

  await db.createClass({ className, datetime, studentId: student.id, serverId: interaction.guildId! });

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
            value: datetime.toLocaleString("hu-HU"),
          },
        ],
      },
    ],
  });

  if (!result) {
    await interaction.editReply("Failed to send message to student.");
    return;
  }

  await interaction.editReply("Class created and message has been sent!");
};

export const commandDescriptorClassesCreate: PrincipalSubcommandCommandDescriptor = {
  subcommandBuilder,
  execute,
};
