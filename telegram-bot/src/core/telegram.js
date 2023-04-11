import TelegramAPI from "node-telegram-bot-api"
import Commands from "./commands.js";
import Buttons from "./buttons.js";
import Core from "./core.js";

export default class Telegram {

    /**
     * @type {TelegramBot}
     */
    static _inst = undefined;

    static set = (token, options) => {
        Telegram._inst = new TelegramAPI(token, options);
    }

    static get = () => {
        return Telegram._inst;
    }

    static registerListener = () => {
        Telegram.get().on("message", async(msg) => {
            const user = Core.createUser(msg.from.id, msg.chat.id);
            const exist = await user.loadData();
            if(!exist) {
                return;
            }

            await Commands.callEvent(user, msg);
        });
        Telegram.get().on("callback_query", async(msg) => {
            const user = Core.createUser(msg.from.id, msg.message.chat.id);
            const exist = await user.loadData();
            if(!exist) {
                return;
            }
            user.setCurrentMessage(msg.message);

            await Buttons.callEvent(user, msg);
        });
    }
}