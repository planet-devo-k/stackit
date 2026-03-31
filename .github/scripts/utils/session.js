import fs from "fs";
import path from "path";

export const getLatestSessionData = () => {
  const sessionDir = path.join(process.cwd(), ".github/data/session");
  const latestFile = fs
    .readdirSync(sessionDir)
    .filter((f) => f.startsWith("session_") && f.endsWith(".json"))
    .sort()
    .at(-1);

  if (!latestFile) throw new Error("session 파일이 없습니다.");

  return JSON.parse(fs.readFileSync(path.join(sessionDir, latestFile), "utf8"));
};
