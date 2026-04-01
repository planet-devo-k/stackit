import { MEMBERS } from "./utils/constants.js";
import { getKSTDateString } from "./utils/date.js";
import { getLatestSessionData } from "./utils/session.js";
import { createDiscordTable } from "./utils/formatter.js";
import { getThisWeekPRs } from "./utils/github.js";

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
        console.log(`(${nowStr})는 현재 스터디 진행 기간이 아닙니다.`);
        return;
      }
    }

    if (currentWeekInfo.type !== "study") {
      console.log(
        `${currentWeekInfo.week}주차는 ${currentWeekInfo.type} 주차이므로 PR 경고를 생략합니다.`,
      );
      return;
    }

    console.log(`${currentWeekInfo.week}주차 PR 마감 사전 경고 시작`);

    const thisMonday = new Date(currentWeekInfo.date.start);
    const thisSunday = new Date(currentWeekInfo.date.end);

    const thisWeekPRs = await getThisWeekPRs({
      github,
      context,
      startDate: thisMonday,
      endDate: thisSunday,
    });

    const submittedMembers = new Set(thisWeekPRs.map((pr) => pr.user.login));

    const memberStatus = {};
    MEMBERS.forEach((member) => {
      memberStatus[member.githubId] = {
        name: member.name,
        githubId: member.githubId,
        discordId: member.discordId,
        submitted: submittedMembers.has(member.githubId),
      };
    });

    const incompleteMembers = Object.values(memberStatus).filter(
      (m) => !m.submitted,
    );

    const tableConfig = {
      headers: ["이름", "PR 제출"],
      paddings: [6, 9],
      renderRow: (id) => {
        const s = memberStatus[id];
        return {
          name: s.name || id,
          prStatus: s.submitted ? "✅" : "❌",
        };
      },
    };

    const incompleteTable =
      incompleteMembers.length > 0
        ? createDiscordTable(
            incompleteMembers.map((m) => m.githubId),
            tableConfig,
          )
        : null;

    if (incompleteMembers.length === 0) {
      console.log("모든 멤버가 PR을 제출했습니다.");
    } else {
      console.log(
        `PR 미제출자: ${incompleteMembers.map((m) => m.name).join(", ")}`,
      );
    }

    return {
      incompleteTable,
      incompleteMembers,
    };
  } catch (error) {
    console.error("PR 마감 경고 집계 실패:", error.message);
    core.setFailed(error.message);
    throw error;
  }
};
