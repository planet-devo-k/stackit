import fs from "fs";
import path from "path";
import { getLatestSessionData } from "./utils/session.js";
import { MEMBERS, GITHUB_CONFIG } from "./utils/constants.js";
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

  const { PROJECT_FIELD_STATUS } = GITHUB_CONFIG;

  const ASSIGNEE_ID = "sgoldenbird";

  const sessionData = getLatestSessionData();
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

  const topicLine = (topic) => {
    if (topic.section) {
      return `  * \`${topic.section}\` ${topic.name}`;
    }
    return `  * ${topic.name}`;
  };

  try {
    // ── Session 본문 생성 ──
    const scheduleText = sessionData.schedule
      .map((week) => {
        const dateRange = `**Week${week.week}** **\`${week.title}\`** ${week.date.start} ~ ${week.date.end}`;
        const topicsText = week.topics.map((t) => topicLine(t)).join("\n");
        return `${dateRange}\n\n${topicsText}`;
      })
      .join("\n\n");

    const sessionBody = replacePlaceholders(
      removeYamlFrontmatter(sessionTemplate),
      {
        source: sessionData.source,
        duration: sessionData.duration,
        start_date: sessionData.date.start,
        end_date: sessionData.date.end,
        schedule_text: scheduleText,
      },
    );

    const thisSessionGoal = await createIssue({
      github,
      context,
      title: `\`Session${SESSION_ID}: Week${sessionStartWeek} ~ Week${sessionEndWeek}\``,
      body: sessionBody,
      assignees: [ASSIGNEE_ID],
      labels: ["goal", "session", "도감"],
      milestone: Number(sessionData.milestone_id),
    });

    console.log(`Session Goal 생성 완료: #${thisSessionGoal.number}`);

    // ── Week 본문 생성 ──
    const membersWeeklyChecklist = MEMBERS.map(
      (member) => `- [ ] ${member.name}`,
    ).join("\n");

    const createdWeekGoals = [];

    for (const weekData of sessionData.schedule) {
      const weekTopicsText = weekData.topics
        .map((t) => topicLine(t))
        .join("\n");

      const weekBody = replacePlaceholders(
        removeYamlFrontmatter(weekTemplate),
        {
          title: weekData.title,
          start_date: weekData.date.start,
          end_date: weekData.date.end,
          topics_text: weekTopicsText,
          members_status_checklist: membersWeeklyChecklist,
        },
      );

      const thisWeekGoal = await createIssue({
        github,
        context,
        title: `\`Week${weekData.week}\`: ${weekData.title}`,
        body: weekBody,
        assignees: [ASSIGNEE_ID],
        labels: ["goal", "도감"],
      });

      console.log(
        `Week Goal 생성 완료 week${weekData.week}: #${thisWeekGoal.number}`,
      );
      createdWeekGoals.push({ data: weekData, goal: thisWeekGoal });

      // API 호출 간격 유지 (Secondary Rate Limits 방지용)
      await new Promise((res) => setTimeout(res, 1000));
    }

    // ── 프로젝트 연동 ──
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
    console.log("Session Goal 연동 완료");

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
      console.log(`Week Goal 연동 완료: #${goal.number}`);
    }

    // ── Sub-issue 연결 (Session ← Week) ──
    for (const { data, goal } of createdWeekGoals) {
      await linkSubIssue({
        github,
        parentNodeId: thisSessionGoal.node_id,
        subIssueId: goal.node_id,
      });
    }
    console.log("Sub-issue 연결 완료");

    console.log("모든 작업이 완료되었습니다.");
  } catch (error) {
    core.setFailed(error.message);
  }
};
