import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags,
} from "discord.js";
import {
  loadWarningData,
  saveWarningData,
} from "../../utils/warning-manager.js";
import {
  BOT_CONFIG,
  WARNING_TYPES,
  KICK_TYPES,
} from "../../utils/constants.js";
import { handleKickAndReset } from "./kick-handler.js";

export const handleCommand = async (interaction, client) => {
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

  const warningTypeValue = interaction.options.getString("유형");
  const warningTypeLabel =
    WARNING_TYPES.find((w) => w.value === warningTypeValue)?.label ||
    warningTypeValue;

  const userId = targetMember.id;
  const warnings = loadWarningData();
  const currentCount = (warnings[userId]?.count || 0) + 1;

  warnings[userId] = {
    count: currentCount,
    types: [...(warnings[userId]?.types || []), warningTypeValue],
    messages: [...(warnings[userId]?.messages || [])],
    isConfirmed: [...(warnings[userId]?.isConfirmed || []), false],
  };

  saveWarningData(warnings);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `warn_check_${userId}_${currentCount}_${interaction.channelId}`,
      )
      .setLabel("클릭")
      .setStyle(ButtonStyle.Danger),
  );

  const targetChannel = client.channels.cache.get(BOT_CONFIG.TARGET_CHANNEL_ID);
  const messagePayload = {
    content: `${targetMember} 버튼을 눌러 상세 내용을 확인하세요.`,
    components: [row],
  };

  if (targetChannel) {
    await targetChannel.send(messagePayload);
    await interaction.reply({
      content: `⚠️ ${targetMember.user.tag} ${warningTypeLabel} (누적 ${currentCount}회)`,
      flags: [MessageFlags.Ephemeral],
    });
  } else {
    await interaction.reply(messagePayload);
  }
};

export const handleButton = async (interaction) => {
  const [, , targetId, countStr, adminChannelId] =
    interaction.customId.split("_");
  const count = parseInt(countStr);

  if (interaction.user.id !== targetId) {
    return interaction.reply({
      content: `<@${targetId}>님만 확인 가능합니다.`,
      flags: [MessageFlags.Ephemeral],
    });
  }

  const warnings = loadWarningData();
  const userData = warnings[targetId] || {
    count: 0,
    messages: [],
    isConfirmed: [],
  };
  const isMaxWarning = count >= BOT_CONFIG.MAX_WARNINGS;
  const latestType = userData.types?.[count - 1];
  const warningType = WARNING_TYPES.find((w) => w.value === latestType);
  const kickType = KICK_TYPES.find((k) => k.value === latestType);

  const modal = new ModalBuilder()
    .setCustomId(`warn_modal_${targetId}_${count}_${adminChannelId}`)
    .setTitle(
      isMaxWarning ? "🚨 추방 (경고 5회 누적)" : `⚠️ 경고 (${count}회차)`,
    );

  const detailInput = new TextInputBuilder()
    .setCustomId("warn_reason")
    .setLabel(
      isMaxWarning
        ? `🚫 ${kickType?.label}` || "🚫 추방 조치 안내 (입력 제한시간 5분)"
        : `⚠️ ${warningType?.label}` || "⚠️ 스터디 룰 위반 안내",
    )
    .setStyle(TextInputStyle.Paragraph)
    .setValue(userData.messages?.[count - 1] || "")
    .setPlaceholder(
      userData.isConfirmed?.[count - 1]
        ? "이미 보고가 완료되었습니다."
        : isMaxWarning
          ? "소명 사유가 있다면 입력하고 제출해 주세요.\n미입력시 확인했음으로 간주합니다.\n추후 재가입이 가능합니다."
          : '"확인했습니다" 또는 소명 사유를 입력하고 제출해 주세요.',
    )
    .setRequired(!isMaxWarning && !userData.isConfirmed?.[count - 1]);

  modal.addComponents([new ActionRowBuilder().addComponents(detailInput)]);
  await interaction.showModal(modal);

  if (isMaxWarning && !userData.isConfirmed?.[count - 1]) {
    setTimeout(() => {
      const currentWarnings = loadWarningData();
      if (
        currentWarnings[targetId] &&
        !currentWarnings[targetId].isConfirmed?.[count - 1]
      ) {
        handleKickAndReset(
          interaction.guild,
          targetId,
          "경고 누적 5회 자동 추방 (소명 미제출 5분 경과)",
        );
      }
    }, BOT_CONFIG.TIMEOUT.MODAL_MS);
  }
};

export const handleModal = async (interaction, client) => {
  const [, , targetId, countStr, adminChannelId] =
    interaction.customId.split("_");
  const count = parseInt(countStr);
  const isMaxWarning = count >= BOT_CONFIG.MAX_WARNINGS;

  const warnings = loadWarningData();
  if (warnings[targetId]?.isConfirmed?.[count - 1]) {
    return interaction.reply({
      content: "이미 전송된 보고입니다.",
      flags: [MessageFlags.Ephemeral],
    });
  }

  const userMessage = interaction.fields.getTextInputValue("warn_reason");

  warnings[targetId].messages[count - 1] = userMessage;
  warnings[targetId].isConfirmed[count - 1] = true;
  saveWarningData(warnings);

  const warningTypeLabel = (() => {
    const types = warnings[targetId]?.types || [];
    const countMap = types.reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    return (
      Object.entries(countMap)
        .map(([t, c]) => {
          const label = WARNING_TYPES.find((w) => w.value === t)?.label || t;
          return c > 1 ? `⚠️ ${label} x${c}` : `⚠️ ${label}`;
        })
        .join(", ") || "미분류"
    );
  })();

  const adminChannel = client.channels.cache.get(adminChannelId);
  if (adminChannel) {
    const reportEmbed = new EmbedBuilder()
      .setColor(
        isMaxWarning ? BOT_CONFIG.COLORS.KICK : BOT_CONFIG.COLORS.WARNING,
      )
      .setTitle(isMaxWarning ? "최종 경고 및 추방 보고" : "경고 확인 보고")
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        {
          name: "\u200b",
          value: `${interaction.member.displayName} (<@${targetId}>)`,
          inline: true,
        },
        { name: "\u200b", value: `${count}회차`, inline: true },
        { name: "\u200b", value: warningTypeLabel },
        {
          name: "\u200b",
          value: `\`\`\`${userMessage || "내용 없음"}\`\`\``,
        },
      );

    await adminChannel.send({ embeds: [reportEmbed] });
  }

  await interaction.reply({
    content: isMaxWarning
      ? "확인 보고가 전달되었습니다. 1분 뒤 추방 조치 됩니다. 추후 다시 재가입 가능합니다.\n소명 사유는 검토 후 참작 시 DM으로 안내 드리겠습니다."
      : "확인 보고가 전달되었습니다. 원활한 스터디를 위해 적극적인 참여 부탁드려요!",
    flags: [MessageFlags.Ephemeral],
  });

  if (isMaxWarning) {
    setTimeout(() => {
      handleKickAndReset(
        interaction.guild,
        targetId,
        "경고 5회 누적 및 소명 제출 (1분 대기 후 추방)",
      );
    }, BOT_CONFIG.TIMEOUT.KICK_DELAY_MS);
  }
};
