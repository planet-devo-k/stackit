import { MEMBERS } from "./utils/constants.js";
import { getKSTDateString } from "./utils/date.js";
import { getLatestSessionData } from "./utils/session.js";
import { createMarkdownTable } from "./utils/formatter.js";
import {
  getThisWeekPRs,
  getDiscussionCategories,
  createDiscussion,
  addLabelByName,
  getRepositoryInfo,
} from "./utils/github.js";

export default async ({ github, context, core, test }) => {
  try {
    const sessionData = getLatestSessionData();

    let currentWeekInfo;

    if (test !== null) {
      currentWeekInfo = sessionData.schedule.find((s) => s.week === test);
      if (!currentWeekInfo) {
        console.warn(`테스트 주차(${test})를 찾을 수 없습니다.`);
        return;
      }
      console.log(`[테스트 모드] ${test}주차 강제 지정`);
    } else {
      const nowStr = getKSTDateString(new Date());
      currentWeekInfo = sessionData.schedule.find(
        (s) => nowStr >= s.date.start && nowStr <= s.date.end,
      );
      if (!currentWeekInfo) {
        console.warn(
          `(${getKSTDateString(new Date())})는 현재 스터디 진행 기간이 아닙니다.`,
        );
        return;
      }
    }

    console.log(`${currentWeekInfo.week}주차 모니터링 시작`);

    const thisMonday = new Date(currentWeekInfo.date.start);
    const thisSunday = new Date(currentWeekInfo.date.end);

    const thisWeekPRs = await getThisWeekPRs({
      github,
      context,
      startDate: thisMonday,
      endDate: thisSunday,
    });
    console.log(`이번주 PR 개수 = ${thisWeekPRs.length}`);

    const submittedMembers = new Set(thisWeekPRs.map((pr) => pr.user.login));

    const memberStatus = {};
    MEMBERS.forEach((member) => {
      memberStatus[member.githubId] = {
        name: member.name,
        githubId: member.githubId,
        submitted: submittedMembers.has(member.githubId),
        prUrl: "",
      };
    });

    // ─── PR URL 매핑 ───
    thisWeekPRs.forEach((pr) => {
      const author = pr.user.login;
      if (memberStatus[author]) {
        memberStatus[author].prUrl = pr.html_url;
      }
    });

    // ─── 테이블 구성 ───
    const memberIds = MEMBERS.map((m) => m.githubId);

    const tableConfig = {
      headers: ["이름", "PR 제출", "출석"],
      paddings: [6, 9, 6],
      renderRow: (id) => {
        const s = memberStatus[id];
        return {
          name: s.name || id,
          prStatus: s.submitted ? `✅ [PR](${s.prUrl})` : "❌",
          attendance: "✅",
        };
      },
    };

    // ─── 주간 리포트 생성 ───
    console.log("이번주 리포트 생성 중...");
    const allTable = createMarkdownTable(memberIds, tableConfig);
    const reportTitle = `\`Week${currentWeekInfo.week}\` 주간 활동 리포트`;
    const reportBody = [
      `## THIS WEEK REPORT`,
      ``,
      `**${currentWeekInfo.date.start} ~ ${currentWeekInfo.date.end}** ${currentWeekInfo.title}`,
      ``,
      allTable,
      ``,
      `> 집계 시각: ${getKSTDateString(new Date())} 20:00 (KST)`,
    ].join("\n");

    // ─── GitHub Discussion 생성 ───
    const repository = await getRepositoryInfo({ github, context });
    const categories = await getDiscussionCategories({ github, context });
    const categoryReport = categories.find((cat) =>
      cat.name.toLowerCase().includes("report"),
    );

    let thisWeekReportResult = null;

    if (categoryReport) {
      const thisWeekReport = await createDiscussion({
        github,
        repoId: repository.id,
        categoryId: categoryReport.id,
        title: reportTitle,
        body: reportBody,
      });

      await addLabelByName({
        github,
        context,
        nodeId: thisWeekReport.id,
        labelName: "report",
      });

      thisWeekReportResult = {
        title: reportTitle,
        url: `https://github.com/${context.repo.owner}/${context.repo.repo}/discussions/${thisWeekReport.number}`,
        category: { name: categoryReport.name },
      };
    }

    console.log("주간 모니터링 보고 완료");

    return {
      reportData: thisWeekReportResult,
    };
  } catch (error) {
    console.error("모니터링 프로세스 중 에러 발생:", error.message);
    core.setFailed(error.message);
    throw error;
  }
};
