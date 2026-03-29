import { sendDiscord } from "../utils/discord.js";

export default async ({ github, context, core, data = {} }) => {
  try {
    const incompleteList = data.incompleteTable;
    const incompleteMembers = data.incompleteMembers || [];

    if (!incompleteList || incompleteMembers.length === 0) {
      console.log("모두 과제를 완료하여 미수행자 알림을 생략합니다.");
      return;
    }

    const mention = incompleteMembers.map((m) => `<@${m.discordId}>`).join(" ");

    const discordPayload = {
      content: `마감 1시간 전! 체크해보세요. ${mention}`,
      allowed_mentions: {
        parse: ["everyone", "users"],
      },
      embeds: [
        {
          title: "LAST CALL\n━━━━━━━━━━━━━━━━━━━━━━",
          description: "아직 PR, 리뷰 못했다면 지금이 타이밍이에요!",
          color: 15606862,
          fields: [
            {
              name: "\u200B",
              value: incompleteList,
              inline: false,
            },
          ],
          footer: { text: "일요일 오후 7시 기준 자동 집계" },
        },
      ],
    };

    await sendDiscord({
      channelId: process.env.DISCORD_CHANNEL_ID,
      botToken: process.env.BOT_TOKEN,
      payload: discordPayload,
    });

    console.log("디스코드 알림 전송 완료");
  } catch (error) {
    console.error("알림 전송 실패:", error.message);
    core.setFailed(error.message);
  }
};
