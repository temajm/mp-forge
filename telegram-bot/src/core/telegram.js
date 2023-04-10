import TelegramAPI from "node-telegram-bot-api"

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
}