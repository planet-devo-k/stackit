/**
 * 이슈
 */
export const createIssue = async ({
  github,
  context,
  title,
  body,
  labels,
  assignees,
  milestone,
}) => {
  console.log("이슈 생성 인자:", { labels, assignees, milestone });
  const { data: newIssue } = await github.rest.issues.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title,
    body,
    labels,
    assignees,
    milestone,
  });
  return newIssue;
};

export const linkSubIssue = async ({ github, parentNodeId, subIssueId }) => {
  if (!parentNodeId) return;

  const query = `
    mutation($parentId: ID!, $subIssueId: ID!) { 
      addSubIssue(input: {issueId: $parentId, subIssueId: $subIssueId}) { 
        issue { id } 
      } 
    }
  `;

  await github.graphql(query, {
    parentId: parentNodeId,
    subIssueId: subIssueId,
  });
};

/**
 * PR
 */
export const getThisWeekPRs = async ({
  github,
  context,
  startDate,
  endDate,
}) => {
  const allPRs = await github.paginate(github.rest.pulls.list, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: "all",
    sort: "created",
    direction: "desc",
    per_page: 100,
  });

  console.log(`총 ${allPRs.length}개의 PR을 발견했습니다.`);

  return allPRs.filter((pr) => {
    const createdAt = new Date(pr.created_at);
    return createdAt >= startDate && createdAt <= endDate;
  });
};

/**
 * 이슈를 프로젝트 필드에 연결하고 관련 필드(날짜, 상태, 담당자, 마일스톤)를 동기화합니다.
 */
export const syncIssueToProject = async ({
  github,
  projectId,
  contentId,
  startDateFieldId,
  endDateFieldId,
  startDate,
  endDate,
  statusFieldId,
  statusOptionId,
}) => {
  const addMutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) { item { id } }
    }
  `;
  const addResult = await github.graphql(addMutation, { projectId, contentId });
  const itemId = addResult.addProjectV2ItemById.item.id;

  console.log("GitHub 프로젝트 자동 동기화를 위해 2초간 대기합니다...");
  await new Promise((res) => setTimeout(res, 2000));

  const updateMutation = `
    mutation($projectId: ID!, $itemId: ID!, $startField: ID!, $endField: ID!, $startVal: Date!, $endVal: Date!, $statusField: ID!, $statusVal: String!) {
      start: updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $startField, value: { date: $startVal } }) { projectV2Item { id } }
      end: updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $endField, value: { date: $endVal } }) { projectV2Item { id } }
      status: updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $statusField, value: { singleSelectOptionId: $statusVal } }) { projectV2Item { id } }
    }
  `;

  await github.graphql(updateMutation, {
    projectId,
    itemId,
    startField: startDateFieldId,
    endField: endDateFieldId,
    startVal: startDate,
    endVal: endDate,
    statusField: statusFieldId,
    statusVal: statusOptionId,
  });
};

/**
 * Review
 */
export const requestReviewers = async ({
  github,
  context,
  pullNumber,
  reviewers,
}) => {
  if (!reviewers || reviewers.length === 0) return;

  await github.rest.pulls.requestReviewers({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pullNumber,
    reviewers: reviewers,
  });
};

/**
 * Repository
 */
export const getRepositoryInfo = async ({ github, context }) => {
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        id
      }
    }
  `;
  const res = await github.graphql(query, {
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  return res.repository;
};

/**
 * Discussion
 */
export const createDiscussion = async ({
  github,
  repoId,
  categoryId,
  title,
  body,
}) => {
  const createQuery = `
    mutation($repoId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
      createDiscussion(input: {
        repositoryId: $repoId,
        categoryId: $categoryId,
        title: $title,
        body: $body
      }) {
        discussion {
          id
          number
        }
      }
    }
  `;

  const res = await github.graphql(createQuery, {
    repoId,
    categoryId,
    title,
    body,
  });

  return res.createDiscussion.discussion;
};

export const getDiscussionCategories = async ({ github, context }) => {
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        discussionCategories(first: 10) {
          nodes { id name }
        }
      }
    }
  `;
  const res = await github.graphql(query, {
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  return res.repository.discussionCategories.nodes;
};

/**
 * 이름으로 라벨을 찾아 대상(Node)에 추가합니다.
 * 목록 조회 + ID 매칭 + 부착을 한 번에 처리합니다.
 */
export const addLabelByName = async ({
  github,
  context,
  nodeId,
  labelName,
}) => {
  if (!labelName) return;

  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        labels(first: 100) {
          nodes { id name }
        }
      }
    }
  `;
  const res = await github.graphql(query, {
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  const labels = res.repository.labels.nodes;
  const targetLabel = labels.find(
    (l) => l.name.toLowerCase() === labelName.toLowerCase(),
  );

  if (!targetLabel) {
    console.log(`라벨을 찾을 수 없습니다: ${labelName}`);
    return;
  }

  const addMutation = `
    mutation($labelableId: ID!, $labelIds: [ID!]!) {
      addLabelsToLabelable(input: {
        labelableId: $labelableId,
        labelIds: $labelIds
      }) { clientMutationId }
    }
  `;

  await github.graphql(addMutation, {
    labelableId: nodeId,
    labelIds: [targetLabel.id],
  });
};
