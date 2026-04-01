import { sendDiscord } from "../utils/discord.js";
import { DISCORD_CONFIG } from "../utils/constants.js";

export default async ({ github, context, core, data }) => {
  try {
    const pr = data.pr || context.payload.pull_request;
    const mention = `<@&${DISCORD_CONFIG.ROLE.MEMBER_ID}>`;

    const discordPayload = {
      content: `${mention} 새로운 PR이 생성되었습니다.`,
      allowed_mentions: {
        parse: ["everyone", "roles", "users"],
      },
      embeds: [
        {
          title: "NEW PR\n━━━━━━━━━━━━━━━━━━━━━━",
          description: `[${pr.title}](${pr.html_url})`,
          color: 5815039,
          fields: [{ name: "작성자", value: pr.user.login, inline: true }],
        },
      ],
    };

    await sendDiscord({
      channelId: process.env.DISCORD_CHANNEL_ID,
      botToken: process.env.BOT_TOKEN,
      payload: discordPayload,
    });

    console.log("디스코드 PR 알림 전송 완료");
  } catch (error) {
    console.error("알림 전송 실패:", error.message);
    core.setFailed(error.message);
  }
};
