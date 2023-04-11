import TelegramAPI from "node-telegram-bot-api"
import Commands from "./commands.js";
import Buttons from "./buttons.js";

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
        Telegram.get().on("message", (msg) => {
            Commands.callEvent(msg);
        });
        Telegram.get().on("callback_query", (msg) => {
            Buttons.callEvent(msg);
        });
    }
}