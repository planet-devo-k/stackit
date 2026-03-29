import {
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { WARNING_TYPES, KICK_TYPES } from "../utils/constants.js";
import "dotenv/config";

const commands = [
  new SlashCommandBuilder()
    .setName("경고")
    .setDescription("특정 유저에게 경고를 부여하고 확인 버튼을 생성합니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("유저")
        .setDescription("경고할 유저를 선택하세요")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("유형")
        .setDescription("경고 유형을 선택하세요")
        .setRequired(true)
        .addChoices(...WARNING_TYPES),
    ),

  new SlashCommandBuilder()
    .setName("추방")
    .setDescription("특정 유저를 추방하고 확인 버튼을 생성합니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("유저")
        .setDescription("추방할 유저를 선택하세요")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("사유")
        .setDescription("추방 유형을 선택하세요")
        .setRequired(true)
        .addChoices(...KICK_TYPES),
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN_ALERT);

(async () => {
  try {
    console.log("슬래시 명령어 등록 시작...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.BOT_ID_ALERT,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );
    console.log("슬래시 명령어 등록 완료!");
  } catch (error) {
    console.error(error);
  }
})();
