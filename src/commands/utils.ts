import {
  APIEmbed,
  APIEmbedField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  InteractionEditReplyOptions,
  PermissionFlagsBits,
  SlashCommandStringOption,
} from "discord.js";
import logger from "../logger";

export const replyWithNotEnoughPermissions = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  await interaction.reply({
    content: "You do not have enough permissions to use this command.",
    ephemeral: true,
  });
};

export const isUserAdmin = async (interaction: ChatInputCommandInteraction): Promise<boolean> => {
  const guild = await interaction.guild!.fetch();
  const member = guild.members.cache.get(interaction.user.id) ?? (await guild.members.fetch(interaction.user.id));

  const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
  logger.debug(`User ${interaction.user.tag} used admin command. Permission granted: ${isAdmin ? "yes" : "no"}`);

  return isAdmin;
};

export type CreatePaginatedEmbedProps<T> = {
  interaction: ChatInputCommandInteraction;
  items: T[];
  mapper: (item: T) => APIEmbedField;
  currentPage?: number;
  embedOptions?: Partial<APIEmbed>;
  maxItemsPerPage?: number;
};

export const sendPaginatedMessage = async <T>({
  interaction,
  items,
  mapper,
  currentPage = 0,
  embedOptions = {},
  maxItemsPerPage = 10,
}: CreatePaginatedEmbedProps<T>) => {
  const itemFields = items.map(mapper);
  const pages = Math.ceil(itemFields.length / maxItemsPerPage) || 1;
  const paginatedItems =
    Array.from({ length: pages }, (_, i) => itemFields.slice(i * maxItemsPerPage, (i + 1) * maxItemsPerPage)) ?? [];

  const getFields = (page: number) =>
    (paginatedItems[page] ?? []).concat([{ name: "Page", value: `${page + 1}/${pages}` }]);

  const previousPageButton = new ButtonBuilder()
    .setCustomId("previous-page")
    .setEmoji("⬅️")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);

  const homePageButton = new ButtonBuilder()
    .setCustomId("home-page")
    .setEmoji("🏠")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

  const nextPageButton = new ButtonBuilder()
    .setCustomId("next-page")
    .setEmoji("➡️")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(false);

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    previousPageButton,
    homePageButton,
    nextPageButton,
  );

  const getEmbed = (): InteractionEditReplyOptions => ({
    embeds: [
      {
        ...embedOptions,
        fields: getFields(currentPage),
      },
    ],
    components: [buttons],
  });

  const msg = await interaction.editReply(getEmbed());

  const mc = msg.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 60000,
  });

  mc.on("collect", async (i) => {
    if (i.customId === "previous-page") {
      currentPage -= 1;
      previousPageButton.setDisabled(currentPage === 0);
      homePageButton.setDisabled(currentPage === 0);
      nextPageButton.setDisabled(currentPage === pages - 1);
    } else if (i.customId === "next-page") {
      currentPage += 1;
      previousPageButton.setDisabled(currentPage === 0);
      homePageButton.setDisabled(currentPage === 0);
      nextPageButton.setDisabled(currentPage === pages - 1);
    } else if (i.customId === "home-page") {
      currentPage = 0;
      previousPageButton.setDisabled(true);
      homePageButton.setDisabled(true);
      nextPageButton.setDisabled(false);
    }

    await i.update(getEmbed());
  });
};
