import { DISCORD_CONFIG } from "../utils/constants.js";
import { sendDiscord } from "../utils/discord.js";

export default async ({ github, context, core }) => {
  const mention = `<@&${DISCORD_CONFIG.ROLE.MEMBER_ID}>`;

  try {
    const discordPayload = {
      content: `${mention} 함께 배우며 성장하는 시간, 이따 만나요!`,
      allowed_mentions: {
        parse: ["everyone", "roles", "users"],
      },
      embeds: [
        {
          title: "오늘 스터디 있는 날\n━━━━━━━━━━━━━━━━━━━━━━",
          color: 16374876,
          fields: [
            {
              name: "When",
              value: "✓ 매주 일요일 오후 10시",
            },
          ],
        },
      ],
    };

    await sendDiscord({
      channelId: process.env.DISCORD_CHANNEL_ID,
      botToken: process.env.BOT_TOKEN,
      payload: discordPayload,
    });

    console.log("스터디 모임 리마인더 알림 전송 완료");
  } catch (error) {
    console.error("알림 전송 실패:", error.message);
    core.setFailed(error.message);
  }
};
