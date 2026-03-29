import { sendDiscord } from "../utils/discord.js";

export default async ({ github, context, core, data }) => {
  try {
    const pr = data.pr || context.payload.pull_request;
    const reviewers = data.reviewers || "리뷰어 지정 중...";
    let mention = reviewers;
    let reviewersGithubIds = reviewers;
    if (Array.isArray(reviewers) && reviewers.length > 0) {
      mention = reviewers.map((m) => `<@${m.discordId}>`).join(" ");
      reviewersGithubIds = reviewers.map((m) => m.githubId).join(", ");
    }

    const discordPayload = {
      // content: `새로운 PR이 생성되었습니다.\n코드 리뷰가 기다리고 있어요. ${mention}`,
      content: `새로운 PR이 생성되었습니다.`,
      allowed_mentions: {
        parse: ["everyone", "roles", "users"],
      },
      embeds: [
        {
          title: "NEW PR\n━━━━━━━━━━━━━━━━━━━━━━",
          description: `[${pr.title}](${pr.html_url})`,
          color: 5815039,
          fields: [
            { name: "작성자", value: pr.user.login, inline: true },
            // {
            //   name: "리뷰어",
            //   value: reviewersGithubIds,
            //   inline: true,
            // },
          ],
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
