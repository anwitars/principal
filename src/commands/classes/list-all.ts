import { APIEmbedField } from "discord.js";
import { PrincipalCommandExecutor, PrincipalSubcommandBuilder } from "../../commands";
import { isUserAdmin, replyWithNotEnoughPermissions, sendPaginatedMessage } from "../utils";
import db from "../../database/instance";
import { ClassModel } from "../../database/models";

const subcommandBuilder: PrincipalSubcommandBuilder = (subcommand) =>
  subcommand
    .setName("list-all")
    .setDescription("List all classes for all students. Only available for the administrator.");

const execute: PrincipalCommandExecutor = async (interaction) => {
  const isAdmin = await isUserAdmin(interaction);
  if (!isAdmin) {
    await replyWithNotEnoughPermissions(interaction);
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const classes = await db.getClasses(interaction.guildId!, {
    filter: { datetime: { $gte: new Date() } },
  });

  const mapper = (item: ClassModel): APIEmbedField => ({
    name: item.className,
    value: `${item.datetime.toLocaleString("hu-HU")} | <@${item.studentId}>`,
  });

  await sendPaginatedMessage({
    interaction,
    items: classes,
    mapper,
    maxItemsPerPage: 3,
    embedOptions: {
      title: "Classes",
      description: "List of classes",
    },
  });
};

export const commandDescriptorClassesList_All = {
  subcommandBuilder,
  execute,
};
