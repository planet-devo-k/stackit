import { EmbedBuilder, MessageFlags } from "discord.js";
import {
  loadWarningData,
  saveWarningData,
} from "../../utils/warning-manager.js";
import { BOT_CONFIG, KICK_TYPES } from "../../utils/constants.js";

export const handleKickAndReset = async (guild, targetId, type) => {
  try {
    const member =
      guild.members.cache.get(targetId) ??
      (await guild.members.fetch(targetId));
    if (!member) return;

    await member.kick(type);

    const warnings = loadWarningData();
    delete warnings[targetId];
    saveWarningData(warnings);

    console.log(`추방 완료\n대상: ${targetId}, 유형: ${type}`);
  } catch (error) {
    console.error("추방 처리 중 에러 발생:", error);
  }
};

export const handleKickCommand = async (interaction, client) => {
  const targetUser = interaction.options.getUser("유저");
  if (!targetUser) {
    return interaction.reply({
      content: "유저를 찾을 수 없습니다.",
      flags: [MessageFlags.Ephemeral],
    });
  }

  const targetMember =
    interaction.guild.members.cache.get(targetUser.id) ??
    (await interaction.guild.members.fetch(targetUser.id));

  const typeValue = interaction.options.getString("유형");
  const typeLabel = `🚫 ${KICK_TYPES.find((k) => k.value === typeValue)?.label || typeValue}`;

  await handleKickAndReset(interaction.guild, targetMember.id, typeLabel);

  const adminChannel = client.channels.cache.get(BOT_CONFIG.TARGET_CHANNEL_ID);
  if (adminChannel) {
    const embed = new EmbedBuilder()
      .setColor(BOT_CONFIG.COLORS.KICK)
      .setTitle("추방 처리 보고")
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        { name: "\u200b", value: `<@${targetMember.id}>`, inline: true },
        { name: "\u200b", value: typeLabel, inline: true },
      );
    await adminChannel.send({ embeds: [embed] });
  }

  await interaction.reply({
    content: `${targetMember.user.tag} 추방 처리가 완료되었습니다.`,
    flags: [MessageFlags.Ephemeral],
  });
};
