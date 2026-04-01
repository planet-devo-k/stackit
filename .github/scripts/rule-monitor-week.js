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

export default async ({ github, context, core }) => {
  try {
    const sessionData = getLatestSessionData();
    const nowStr = getKSTDateString(new Date());
    const currentWeekInfo = sessionData.schedule.find(
      (s) => nowStr >= s.date.start && nowStr <= s.date.end,
    );

    if (!currentWeekInfo) {
      console.warn(`(${nowStr})는 현재 스터디 진행 기간이 아닙니다.`);
      return;
    }

    console.log(`${currentWeekInfo.week}주차 모니터링 시작`);

    const thisMonday = new Date(currentWeekInfo.date.start);
    const thisSunday = new Date(currentWeekInfo.date.end);

    // ─── PR 제출 현황 조회 ───
    const thisWeekPRs = await getThisWeekPRs({
      github,
      context,
      startDate: thisMonday,
      endDate: thisSunday,
    });
    console.log(`이번주 PR 개수 = ${thisWeekPRs.length}`);

    // ─── 멤버 상태 초기화 ───
    const submittedAuthors = new Set(thisWeekPRs.map((pr) => pr.user.login));

    const memberStatus = {};
    MEMBERS.forEach((member) => {
      memberStatus[member.githubId] = {
        name: member.name,
        githubId: member.githubId,
        submitted: submittedAuthors.has(member.githubId),
        prUrl: "",
        attendance: "present", // 출석은 추후 수동 반영
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
          prStatus: s.submitted ? "✅" : "❌",
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
      `**${currentWeekInfo.title}** (${currentWeekInfo.date.start} ~ ${currentWeekInfo.date.end})`,
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
