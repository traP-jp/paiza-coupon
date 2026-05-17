import fs from "node:fs/promises";
import { Api } from "traq-bot-ts";
import { getEnv } from "./shared";

const TRAQ_BOT_TOKEN = getEnv("TRAQ_BOT_TOKEN");

const api = new Api({
    baseApiParams: {
        headers: { Authorization: `Bearer ${TRAQ_BOT_TOKEN}` },
    },
});

const MESSAGE_ID = getEnv("MESSAGE_ID");
const STAMP_ID = getEnv("STAMP_ID");

const { data: messages } = await api.messages.getMessage(MESSAGE_ID);

const users = messages.stamps
    .filter(({ stampId }) => stampId === STAMP_ID)
    .map(({ userId }) => userId);

fs.writeFile("./users.json", JSON.stringify(users));
