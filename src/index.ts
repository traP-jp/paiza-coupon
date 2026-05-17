import { Client, Api, type Message } from "traq-bot-ts";
import { getEnv } from "./shared";
import TARGET_USERS from "../users.json";

const TRAQ_BOT_TOKEN = getEnv("TRAQ_BOT_TOKEN");

const client = new Client({
    token: TRAQ_BOT_TOKEN,
});

const api = new Api({
    baseApiParams: {
        headers: { Authorization: `Bearer ${TRAQ_BOT_TOKEN}` },
    },
});

const PAIZA_COUPON_CODE = getEnv("PAIZA_COUPON_CODE");

const CONTENT = `
クーポンコード:
\`\`\`text
${PAIZA_COUPON_CODE}
\`\`\`

登録方法は[こちら](https://paizasupport.zendesk.com/hc/ja/articles/42885530811161)
`.trim();

const REJECT_MESSAGE = `
申請がありません

誤りと思われる場合は #general/executive/relations にご連絡ください。
`.trim();

client.listen(() => {
    console.log("Ready...");
});

client.on("DIRECT_MESSAGE_CREATED", ({ body: { message } }) => {
    const reject = () => {
        console.log(`Reject: ${message.user.name}`);
        api.channels.postMessage(message.channelId, {
            content: REJECT_MESSAGE,
            embed: true,
        });
    };

    const approve = () => {
        console.log(`Send to: ${message.user.name}`);
        api.channels.postMessage(message.channelId, {
            content: CONTENT,
        });
    };

    if (message.plainText.trim() !== message.user.name) return;

    if (!TARGET_USERS.includes(message.user.id)) {
        reject();
        return;
    }

    approve();
});
