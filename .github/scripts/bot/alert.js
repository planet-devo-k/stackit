// node .github/scripts/bot/alert.js
import { Client, GatewayIntentBits, MessageFlags } from "discord.js";
import "dotenv/config";
import {
  handleCommand,
  handleButton,
  handleModal,
} from "./handlers/warning-handler.js";
import { handleKickCommand } from "./handlers/kick-handler.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("clientReady", () => {
  console.log(`${client.user.tag} 서버 관리 봇 가동 시작!`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "경고") {
        await handleCommand(interaction, client);
      } else if (interaction.commandName === "추방") {
        await handleKickCommand(interaction, client);
      }
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModal(interaction, client);
    }
  } catch (error) {
    console.error("상호작용 처리 중 전역 에러:", error);
  }
});

client.login(process.env.BOT_TOKEN_ALERT);
