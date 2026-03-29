import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, "../../data/warnings.json");

export const loadWarningData = () => {
  try {
    if (!fs.existsSync(DB_PATH)) return {};
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("경고 데이터 로드 실패:", error);
    return {};
  }
};

export const saveWarningData = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("경고 데이터 저장 실패:", error);
  }
};
