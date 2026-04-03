import { MEMBERS } from "./utils/constants.js";
import { getKSTDateString } from "./utils/date.js";
import { getLatestSessionData } from "./utils/session.js";
import { createMarkdownTable } from "./utils/formatter.js";
import {
  createDiscussion,
  getRepositoryInfo,
  getDiscussionCategories,
  getThisSessionPRs,
  parseWeeksFromTitle,
  addLabelByName,
} from "./utils/github.js";

const PENALTY_PER_ISSUE = 1000;

export default async ({ github, context, core, test }) => {
  try {
    const sessionData = getLatestSessionData();
    const nowStr = getKSTDateString(new Date());
    const sessionEnd = getKSTDateString(new Date(sessionData.date.end));

    if (test) {
      console.log("[테스트 모드] 날짜 체크를 건너뜁니다.");
    } else if (nowStr !== sessionEnd) {
      console.warn(
        `오늘은 세션 종료일(${sessionEnd})이 아닙니다. 현재 날짜: ${nowStr}. 세션 리포트 생성을 스킵합니다.`,
      );
      return;
    }

    console.log(
      `세션 ${sessionData.id} 리포트 작성 시작 (${sessionData.date.start} ~ ${sessionData.date.end})`,
    );

    const schedule = sessionData.schedule;
    const studyWeeks = schedule.filter((s) => s.type === "study");
    const allWeeks = schedule.map((s) => s.week);
    const DEPOSIT = sessionData.deposit.amount;
    const INTEREST = sessionData.deposit.interest || 0;

    // ─── 출석 정보 매핑 (주차별 attendees) ───
    const attendanceByWeek = {};
    schedule.forEach((s) => {
      attendanceByWeek[s.week] = {};
      (s.attendees || []).forEach((a) => {
        if (a.name) {
          attendanceByWeek[s.week][a.name] = a.status;
        }
      });
    });

    // ─── 멤버 데이터 초기화 ───
    const reportData = {};
    MEMBERS.forEach((member) => {
      reportData[member.githubId] = {
        name: member.name,
        githubId: member.githubId,
        weeks: {},
        totalPRs: 0,
        absentCount: 0,
        lateCount: 0,
        missedPRCount: 0,
      };

      allWeeks.forEach((w) => {
        reportData[member.githubId].weeks[w] = {
          pr: false,
          prUrl: "",
          attendance: "present",
        };
      });
    });

    // ─── 출석 반영 ───
    MEMBERS.forEach((member) => {
      allWeeks.forEach((w) => {
        const weekAttendance = attendanceByWeek[w] || {};
        const status = weekAttendance[member.name];
        if (status === "absent") {
          reportData[member.githubId].weeks[w].attendance = "absent";
          reportData[member.githubId].absentCount++;
        } else if (status === "late") {
          reportData[member.githubId].weeks[w].attendance = "late";
          reportData[member.githubId].lateCount++;
        }
      });
    });

    // ─── PR 집계 (study 주차만) ───
    const sessionPRs = await getThisWeekPRs({
      github,
      context,
      weeks: sessionData.weeks,
    });
    console.log(`세션 기간 내 PR 개수 = ${sessionPRs.length}`);

    sessionPRs.forEach((pr) => {
      const author = pr.user.login;
      const prWeeks = parseWeeksFromTitle(pr.title);
      if (prWeeks.length === 0 || !reportData[author]) return;

      const weekNum = Math.max(...prWeeks);
      const isStudyWeek = studyWeeks.some((s) => s.week === weekNum);
      if (!isStudyWeek) return;

      reportData[author].weeks[weekInfo.week].pr = true;
      reportData[author].weeks[weekInfo.week].prUrl = pr.html_url;
      reportData[author].totalPRs++;
    });

    // ─── PR 미제출 횟수 집계 (study 주차만) ───
    MEMBERS.forEach((member) => {
      studyWeeks.forEach((s) => {
        if (!reportData[member.githubId].weeks[s.week].pr) {
          reportData[member.githubId].missedPRCount++;
        }
      });
    });

    // ─── 보증금 정산 ───
    const memberIds = MEMBERS.map((m) => m.githubId);
    const settlements = {};
    let totalPenaltyPool = 0;

    memberIds.forEach((id) => {
      const s = reportData[id];
      const penalty =
        (s.absentCount + s.lateCount + s.missedPRCount) * PENALTY_PER_ISSUE;
      const remaining = DEPOSIT - penalty;
      settlements[id] = { penalty, remaining };
      totalPenaltyPool += penalty;
    });

    const communityFund = totalPenaltyPool + INTEREST;
    const communityFundPerMember = Math.floor(communityFund / MEMBERS.length);

    // ─── 활동 테이블 (5주씩 분할) ───
    const studyWeekNums = studyWeeks.map((s) => s.week);
    const CHUNK_SIZE = 5;
    const weekChunks = [];
    for (let i = 0; i < allWeeks.length; i += CHUNK_SIZE) {
      weekChunks.push(allWeeks.slice(i, i + CHUNK_SIZE));
    }

    const activityTables = weekChunks.map((chunk) => {
      const tableConfig = {
        headers: ["이름", ...chunk.map((w) => `W${w}`)],
        paddings: [6, ...chunk.map(() => 15)],
        renderRow: (id) => {
          const s = reportData[id];
          const row = { name: s.name };

          chunk.forEach((w) => {
            const wData = s.weeks[w];
            const parts = [];
            const isStudyWeek = studyWeekNums.includes(w);

            if (wData.attendance === "absent") {
              parts.push("❌결석");
            } else if (wData.attendance === "late") {
              parts.push("⏰지각");
            } else {
              parts.push("✅출석");
            }

            if (isStudyWeek) {
              if (wData.pr) {
                parts.push(`✅[PR](${wData.prUrl})`);
              } else {
                parts.push("❌PR");
              }
            }

            row[`week${w}`] = parts.join(" ");
          });

          return row;
        },
      };

      return createMarkdownTable(memberIds, tableConfig);
    });

    // ─── 정산 테이블 ───
    const settlementTableConfig = {
      headers: ["이름", "보증금", "결석", "지각", "PR미제출", "차감", "환급액"],
      paddings: [6, 8, 6, 6, 8, 8, 8],
      renderRow: (id) => {
        const s = reportData[id];
        const st = settlements[id];
        return {
          name: s.name,
          deposit: `${DEPOSIT.toLocaleString()}원`,
          absent: `${s.absentCount}회`,
          late: `${s.lateCount}회`,
          missedPR: `${s.missedPRCount}회`,
          penalty: `-${st.penalty.toLocaleString()}원`,
          refund: `${st.remaining.toLocaleString()}원`,
        };
      },
    };

    const settlementTable = createMarkdownTable(
      memberIds,
      settlementTableConfig,
    );

    // ─── 리포트 생성 ───
    const reportTitle = `\`Session${sessionData.id}\` 세션 활동 리포트`;
    const reportBody = [
      `## THIS SESSION REPORT`,
      ``,
      `**${sessionData.date.start} ~ ${sessionData.date.end}**`,
      ``,
      ...activityTables.flatMap((table) => [table, ``]),
      `### 정산`,
      ``,
      settlementTable,
      ``,
      `| 항목 | 금액 |`,
      `|------|------|`,
      `| 차감 기준 | 결석/PR미제출 1건당 -${PENALTY_PER_ISSUE.toLocaleString()}원 |`,
      `| 차감 총액 | ${totalPenaltyPool.toLocaleString()}원 |`,
      `| 이자 | ${INTEREST.toLocaleString()}원 |`,
      `| 총 적립금 | ${communityFund.toLocaleString()}원 |`,
      `| 분배금 (1인당) | ${communityFundPerMember.toLocaleString()}원 |`,
      ``,
      `> 집계 시각: ${getKSTDateString(new Date())} 21:00 (KST)`,
      ``,
      `수고하셨습니다!`,
    ].join("\n");

    // ─── GitHub Discussion 생성 ───
    const repository = await getRepositoryInfo({ github, context });
    const categories = await getDiscussionCategories({ github, context });
    const categoryReport = categories.find((cat) =>
      cat.name.toLowerCase().includes("report"),
    );

    let thisSessionReportResult = null;

    if (categoryReport) {
      const thisSessionReport = await createDiscussion({
        github,
        repoId: repository.id,
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

      console.log(`Session 리포트 생성 완료: ${thisSessionReport.id}`);

      thisSessionReportResult = {
        title: reportTitle,
        url: `https://github.com/${context.repo.owner}/${context.repo.repo}/discussions/${thisSessionReport.number}`,
        category: { name: categoryReport.name },
      };
    } else {
      console.warn("report 카테고리를 찾을 수 없습니다.");
    }

    return {
      reportData: thisSessionReportResult,
    };
  } catch (error) {
    console.error("세션 리포트 생성 중 에러 발생:", error.message);
    core.setFailed(error.message);
    throw error;
  }
};
