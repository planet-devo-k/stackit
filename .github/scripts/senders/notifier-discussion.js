import { sendDiscord } from "../utils/discord.js";
import { DISCORD_CONFIG } from "../utils/constants.js";

export default async ({ github, context, core, data = {} }) => {
  try {
    const targetData = data.reportData || data;
    const title = targetData?.title || "NEW POST";
    const author = targetData?.user?.login || "Bot";
    const url =
      targetData?.html_url ||
      targetData?.url ||
      "https://github.com/planet-devo-k/solveit/discussions";
    const category = targetData?.category?.name || "General";
    const isReport = category.toLowerCase().includes("report");
    const mention = `<@&${DISCORD_CONFIG.ROLE.MEMBER_ID}>`;

    const discordPayload = {
      content: isReport
        ? `${mention} 스터디 리포트가 발행되었습니다.`
        : `${mention} 새로운 게시물이 올라왔어요. 함께 확인해봐요.`,
      allowed_mentions: {
        parse: ["everyone", "roles", "users"],
      },
      embeds: [
        {
          title: `${isReport ? "NEW REPORT" : "NEW POST"}\n━━━━━━━━━━━━━━━━━━━━━━`,
          description: `[${title}](${url})`,
          color: isReport ? 16777215 : 5815039,
          fields: [
            {
              name: "작성자",
              value: isReport ? "Bot" : author,
              inline: true,
            },
            {
              name: "카테고리",
              value: isReport ? "Report" : category,
              inline: true,
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

    console.log("디스코드 Discussion 알림 전송 완료");
  } catch (error) {
    console.error("알림 전송 실패:", error.message);
    core.setFailed(error.message);
    throw error;
  }
};
