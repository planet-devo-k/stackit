import fs from "fs";
import path from "path";
import sessionData from "../data/session/session_6.json" with { type: "json" };
import { MEMBERS, STUDY_CONFIG, GITHUB_CONFIG } from "./utils/constants.js";
import {
  removeYamlFrontmatter,
  replacePlaceholders,
} from "./utils/formatter.js";
import {
  createIssue,
  linkSubIssue,
  syncIssueToProject,
} from "./utils/github.js";

export default async ({ github, context, core }) => {
  const {
    PROJECT_FIELD_ID,
    PROJECT_FIELD_STATUS_ID,
    START_DATE_FIELD_ID,
    END_DATE_FIELD_ID,
  } = process.env;

  const { RULES, URL } = STUDY_CONFIG;
  const { PROGRAMMERS_BASE } = URL;
  const { PROJECT_FIELD_STATUS, MILESTONE, ISSUE } = GITHUB_CONFIG;

  const ASSIGNEE_ID = "sgoldenbird";
  const SESSION_ID = sessionData.id;

  const sessionTemplatePath = path.join(
    process.cwd(),
    ".github/ISSUE_TEMPLATE/goal_track_session.md",
  );
  const weekTemplatePath = path.join(
    process.cwd(),
    ".github/ISSUE_TEMPLATE/goal_track_week.md",
  );

  let sessionTemplate = fs.readFileSync(sessionTemplatePath, "utf8");
  let weekTemplate = fs.readFileSync(weekTemplatePath, "utf8");

  const sessionStartWeek = Math.min(...sessionData.weeks);
  const sessionEndWeek = Math.max(...sessionData.weeks);
  const levelLabels = sessionData.levels.map((lvl) => `level${lvl}`);

  const challengeLink = (c) => {
    return `[${c.name}](${PROGRAMMERS_BASE}/${c.id})`;
  };

  try {
    const sessionChallengesText = sessionData.challenges
      .map((week) => {
        const start = week.date.start;
        const end = week.date.end;
        const dateRange = `**week${week.week}** ${start} MON - ${end} SUN`;
        const thisWeekChallenges =
          week.list.length > 0
            ? week.list.map((item) => `  * ${challengeLink(item)}`).join("\n")
            : "  * 미정";
        return `${dateRange}\n\n${thisWeekChallenges}`;
      })
      .join("\n\n");

    const sessionBody = replacePlaceholders(
      removeYamlFrontmatter(sessionTemplate),
      {
        duration: RULES.WEEKS_PER_SESSION,
        start_date: sessionData.date.start,
        end_date: sessionData.date.end,
        levels: sessionData.levels.join(" and "),
        challenges_text: sessionChallengesText,
      },
    );

    const thisSessionGoal = await createIssue({
      github,
      context,
      title: `\`Session${SESSION_ID}: Week${sessionStartWeek} ~ Week${sessionEndWeek}\``,
      body: sessionBody,
      assignees: [ASSIGNEE_ID],
      labels: ["goal", "programmers", "session", ...levelLabels],
      milestone: Number(MILESTONE.PROGRAMMERS_ID),
    });

    const membersWeeklyChecklist = MEMBERS.map(
      (member) => `- [ ] ${member.name}`,
    ).join("\n");

    const weeksToCreate = sessionData.challenges.slice(0, 10);
    const createdWeekGoals = [];

    for (const weekData of weeksToCreate) {
      const weekChallengesText = weekData.list
        .map((c) => `* ${challengeLink(c)}`)
        .join("\n");

      const weekBody = replacePlaceholders(
        removeYamlFrontmatter(weekTemplate),
        {
          levels: sessionData.levels.join(" and "),
          start_date: weekData.date.start,
          end_date: weekData.date.end,
          challenges_text: weekChallengesText,
          members_status_checklist: membersWeeklyChecklist,
        },
      );

      const thisWeekGoal = await createIssue({
        github,
        context,
        title: `\`Week${weekData.week}\``,
        body: weekBody,
        assignees: [ASSIGNEE_ID],
        labels: ["goal", "programmers", ...levelLabels],
      });

      console.log(
        `goal track week 생성 완료 ${weekData.week}: #${thisWeekGoal.number}`,
      );
      createdWeekGoals.push({ data: weekData, goal: thisWeekGoal });

      // API 호출 간격 유지(Secondary Rate Limits 방지용)
      await new Promise((res) => setTimeout(res, 1000));
    }

    await syncIssueToProject({
      github,
      projectId: PROJECT_FIELD_ID,
      contentId: thisSessionGoal.node_id,
      startDateFieldId: START_DATE_FIELD_ID,
      endDateFieldId: END_DATE_FIELD_ID,
      startDate: sessionData.date.start,
      endDate: sessionData.date.end,
      statusFieldId: PROJECT_FIELD_STATUS_ID,
      statusOptionId: PROJECT_FIELD_STATUS.IN_PROGRESS,
    });
    console.log("Session Goal 프로젝트 연동 완료");

    for (const { data, goal } of createdWeekGoals) {
      await syncIssueToProject({
        github,
        projectId: PROJECT_FIELD_ID,
        contentId: goal.node_id,
        startDateFieldId: START_DATE_FIELD_ID,
        endDateFieldId: END_DATE_FIELD_ID,
        startDate: data.date.start,
        endDate: data.date.end,
        statusFieldId: PROJECT_FIELD_STATUS_ID,
        statusOptionId: PROJECT_FIELD_STATUS.TODO,
      });
      console.log(`Week Goal 프로젝트 연동 완료: #${goal.number}`);
    }

    const { data: programmersParent } = await github.rest.issues.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: ISSUE.PROGRAMMERS_NUMBER,
    });

    await linkSubIssue({
      github,
      parentNodeId: programmersParent.node_id,
      subIssueId: thisSessionGoal.node_id,
    });

    for (const { data, goal } of createdWeekGoals) {
      await linkSubIssue({
        github,
        parentNodeId: thisSessionGoal.node_id,
        subIssueId: goal.node_id,
      });
    }

    console.log("모든 작업이 완료되었습니다.");
  } catch (error) {
    core.setFailed(error.message);
  }
};
