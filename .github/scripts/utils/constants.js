export const MEMBERS = [
  {
    name: "송시은",
    githubId: "sgoldenbird",
    discordId: "1235595153142710372",
  },
  {
    name: "손수진",
    githubId: "pappaya109",
    discordId: "347010234562379786",
  },
  {
    name: "전유진",
    githubId: "yuj2n",
    discordId: "392655134116806676",
  },
  {
    name: "조인성",
    githubId: "Insung-Jo",
    discordId: "1337108063793975328",
  },
];

export const STUDY_CONFIG = {
  RULES: {
    // WEEKS_PER_SESSION: 10,
    // MIN_REVIEWS_REQUIRED: 2,
  },
};

export const GITHUB_CONFIG = {
  PROJECT_FIELD_STATUS: {
    TODO: "f75ad846",
    IN_PROGRESS: "47fc9ee4",
    DONE: "98236657",
  },
};

export const DISCORD_CONFIG = {
  ROLE: {
    MEMBER_ID: "1483764477827485747",
    // TEAM_ID: "",
  },
};

export const BOT_CONFIG = {
  ALERT_CHANNEL_ID: "1488126536400765068",
  MAX_WARNINGS: 5,
  TIMEOUT: {
    MODAL_MS: 5 * 60 * 1000,
    KICK_DELAY_MS: 60 * 1000,
  },
  COLORS: {
    WARNING: "#FFFF00",
    KICK: "#FF0000",
  },
};

export const WARNING_TYPES = [
  { name: "Interaction", value: "interaction", label: "상호작용 미준수" },
  {
    name: "Rule Violation",
    value: "rule_violation",
    label: "스터디 룰 미준수",
  },
  { name: "Conflict", value: "conflict", label: "분쟁" },
];

export const KICK_TYPES = [
  {
    name: "Warning Limit",
    value: "warning_limit",
    label: "경고 누적 5회",
  },
  {
    name: "Ghost Member",
    value: "ghost_member",
    label: "고스트 멤버 (가입 후 활동 없음)",
  },
  {
    name: "Long Inactive",
    value: "long_inactive",
    label: "장기간 비활성 (1년 이상 스터디 미참여)",
  },
  {
    name: "No Contribution",
    value: "no_contribution",
    label: "커뮤니티 기여 없음 (1년 이상)",
  },
  {
    name: "No Sharing",
    value: "no_sharing",
    label: "학습 정보 공유 없음",
  },
  {
    name: "Absent No Notice",
    value: "absent_no_notice",
    label: "사전 고지 없이 잠수",
  },
];
