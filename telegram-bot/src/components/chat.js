import Telegram from "../core/telegram.js"
import LogSystem from "../core/logSystem.js";

export default class Chat {

    id = undefined;

    constructor(chat_id) {
        this.id = chat_id;
    }

    sendMessage = (text, options) => {
        return Telegram.get().sendMessage(this.id, text, options).catch(LogSystem.error);
    }
}