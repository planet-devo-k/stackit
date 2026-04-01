import sessionData from "../data/session/session_6.json" with { type: "json" };
import { MEMBERS, STUDY_CONFIG } from "./utils/constants.js";
import { getKSTDateString } from "./utils/date.js";
import { createMarkdownTable } from "./utils/formatter.js";
import {
  createDiscussion,
  getRepositoryInfo,
  getDiscussionCategories,
  getThisWeekPRs,
  addLabelByName,
} from "./utils/github.js";

export default async ({ github, context, core }) => {
  const { RULES } = STUDY_CONFIG;
  const { MIN_REVIEWS_REQUIRED } = RULES;

  try {
    const nowStrDots = getKSTDateString(new Date());
    const sessionStart = new Date(sessionData.date.start);
    const sessionEnd = new Date(sessionData.date.end);
    const weeks = sessionData.challenges.map((c) => c.week);

    if (
      nowStrDots !== getKSTDateString(sessionEnd) &&
      context.eventName !== "workflow_dispatch"
    ) {
      console.warn(
        `오늘은 프로젝트 종료일(${getKSTDateString(sessionEnd)})이 아닙니다. 현재 날짜: ${nowStrDots}. 프로젝트 리포트 생성을 스킵합니다.`,
      );
      return;
    }

    console.log(
      `오늘은 프로젝트 종료일(${sessionData.date.start} ~ ${sessionData.date.end}): 프로젝트 ${sessionData.id} 리포트 작성을 시작합니다.`,
    );

    const repository = await getRepositoryInfo({ github, context });
    const repoId = repository.id;
    const discussionCategories = await getDiscussionCategories({
      github,
      context,
    });
    const categoryReport = discussionCategories.find((cat) =>
      cat.name.toLowerCase().includes("report"),
    );

    const reportData = {};

    MEMBERS.forEach((member) => {
      const githubId = member.githubId;

      reportData[githubId] = {
        name: member.name,
        discordId: member.discordId,
        weeks: {},
        totalPRs: 0,
        totalReviews: 0,
      };

      sessionData.challenges.forEach((challenge) => {
        const w = challenge.week;
        const absentees = challenge.absentees || [];
        const isAbsent = absentees.includes(githubId);

        reportData[githubId].weeks[w] = {
          pr: false,
          reviews: 0,
          isAbsent: isAbsent,
        };
      });
    });

    const sessionPRs = await getThisWeekPRs({
      github,
      context,
      startDate: sessionStart,
      endDate: sessionEnd,
    });

    console.log(`세션 기간 내 PR 개수 = ${sessionPRs.length}`);

    await Promise.all(
      sessionPRs.map(async (pr) => {
        const author = pr.user.login;
        const createdAt = new Date(pr.created_at);
        const weekInfo = sessionData.challenges.find((c) => {
          const start = new Date(c.date.start);
          const end = new Date(c.date.end);
          return createdAt >= start && createdAt <= end;
        });

        if (!weekInfo || !reportData[author]) return;

        const weekNum = weekInfo.week;
        reportData[author].weeks[weekNum].pr = true;
        reportData[author].totalPRs++;

        const { data: reviews } = await github.rest.pulls.listReviews({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: pr.number,
        });

        const uniqueReviewers = new Set(reviews.map((r) => r.user.login));
        uniqueReviewers.forEach((reviewerId) => {
          if (reportData[reviewerId] && reviewerId !== author) {
            reportData[reviewerId].weeks[weekNum].reviews++;
            reportData[reviewerId].totalReviews++;
          }
        });
      }),
    );

    const tableConfig = {
      headers: ["이름", ...weeks.map((w) => `W${w}`), "총합"],
      paddings: [6, ...weeks.map(() => 15), 10],
      renderRow: (id) => {
        const s = reportData[id];
        const row = { name: s.name };
        let attendanceCount = 0;

        weeks.forEach((w) => {
          const wData = s.weeks[w];
          const hasPR = wData.pr;
          const hasRev = wData.reviews >= MIN_REVIEWS_REQUIRED;
          const isAbsent = wData.isAbsent;
          const isSuccess = hasPR && hasRev && !isAbsent;

          if (isSuccess) {
            row[`week${w}`] = "✅";
            attendanceCount++;
          } else {
            const reasons = [];

            if (!hasPR) reasons.push("PR");
            if (!hasRev)
              reasons.push(`리뷰${wData.reviews}/${MIN_REVIEWS_REQUIRED}`);
            if (isAbsent) reasons.push("결석");

            const reasonText =
              reasons.length > 0 ? `(${reasons.join(",")})` : "";
            row[`week${w}`] = `❌${reasonText}`;
          }
        });

        row.total = `${s.totalPRs}PR / ${s.totalReviews}Rev / ${attendanceCount}출석`;
        return row;
      },
    };

    const markdownTable = createMarkdownTable(
      MEMBERS.map((m) => m.githubId),
      tableConfig,
    );
    const reportTitle = `\`Project${sessionData.id}\` 스터디 활동 리포트`;
    const reportBody = `## THIS PROJECT REPORT\n\n${markdownTable}\n\n집계 시각: ${getKSTDateString(new Date())}(KST)\n\n수고하셨습니다!`;

    if (categoryReport) {
      const thisSessionReport = await createDiscussion({
        github,
        repoId: repoId,
        categoryId: categoryReport.id,
        title: reportTitle,
        body: reportBody,
      });

      await addLabelByName({
        github,
        context,
        nodeId: thisSessionReport.id,
        labelName: "report",
      });

      console.log(`프로젝트 리포트 생성 완료: ${thisSessionReport.id}`);

      return {
        title: reportTitle,
        url: `https://github.com/${context.repo.owner}/${context.repo.repo}/discussions/${thisSessionReport.number}`,
      };
    }

    console.warn("report 카테고리를 찾을 수 없습니다.");
    return null;
  } catch (error) {
    console.error("프로젝트 리포트 생성 중 에러 발생:", error.message);
    core.setFailed(error.message);
    throw error;
  }
};
