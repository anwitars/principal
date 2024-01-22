import { APIEmbedField } from "discord.js";
import { PrincipalCommandExecutor, PrincipalSubcommandBuilder } from "../../commands";
import { sendPaginatedMessage } from "../utils";
import db from "../../database/instance";
import { ClassModel } from "../../database/models";

const subcommandBuilder: PrincipalSubcommandBuilder = (subcommand) =>
  subcommand.setName("list").setDescription("List all classes for a student.");

const execute: PrincipalCommandExecutor = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const classes = await db.getClasses(interaction.guildId!, {
    userId: interaction.user.id,
    filter: { datetime: { $gte: new Date() } },
  });

  const mapper = (item: ClassModel): APIEmbedField => ({
    name: item.className,
    value: item.datetime.toLocaleString("hu-HU"),
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

export const commandDescriptorClassesList = {
  subcommandBuilder,
  execute,
};
