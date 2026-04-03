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
      "https://github.com/planet-devo-k/stackit/discussions";
    const category = targetData?.category?.name || "General";
    const isReport = category.toLowerCase().includes("report");
    const isAnnouncement = category.toLowerCase().includes("announcement");
    const mention = `<@&${DISCORD_CONFIG.ROLE.MEMBER_ID}>`;

    const channelId = isAnnouncement
      ? process.env.DISCORD_CHANNEL_ID_ANNOUNCEMENT
      : process.env.DISCORD_CHANNEL_ID;

    let content;
    let embedTitle;
    let embedColor;

    if (isAnnouncement) {
      content = `${mention} 새로운 공지입니다. 필독!`;
      embedTitle = "NEW ANNOUNCEMENT\n━━━━━━━━━━━━━━━━━━━━━━";
      embedColor = 8454002; // ##80FF72
    } else if (isReport) {
      content = `${mention} 스터디 리포트가 발행되었습니다.`;
      embedTitle = "NEW REPORT\n━━━━━━━━━━━━━━━━━━━━━━";
      embedColor = 16777215; // 흰색
    } else {
      content = `${mention} 새로운 게시물이 올라왔어요. 함께 확인해봐요.`;
      embedTitle = "NEW POST\n━━━━━━━━━━━━━━━━━━━━━━";
      embedColor = 5815039;
    }

    const discordPayload = {
      content,
      allowed_mentions: {
        parse: ["everyone", "roles", "users"],
      },
      embeds: [
        {
          title: embedTitle,
          description: `[${title}](${url})`,
          color: embedColor,
          fields: [
            {
              name: "작성자",
              value: isReport ? "Bot" : author,
              inline: true,
            },
            {
              name: "카테고리",
              value: category,
              inline: true,
            },
          ],
        },
      ],
    };

    await sendDiscord({
      channelId,
      botToken: process.env.BOT_TOKEN,
      payload: discordPayload,
    });

    console.log(
      `디스코드 Discussion 알림 전송 완료 (${isAnnouncement ? "announcement" : isReport ? "report" : "post"})`,
    );
  } catch (error) {
    console.error("알림 전송 실패:", error.message);
    core.setFailed(error.message);
    throw error;
  }
};
