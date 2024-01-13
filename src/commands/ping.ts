import { PrincipalCommandExecutor } from "../commands";

export const resolvePing: PrincipalCommandExecutor = async (interaction) => {
    await interaction.reply({
        content: "Pong!",
        ephemeral: true,
    });
};
