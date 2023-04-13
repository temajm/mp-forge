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
        Telegram.get().on("text", async(msg) => {
            console.log(msg);
            const user = Core.createUser(msg.from.id, msg.chat.id, msg.from?.first_name != null ? msg.from?.first_name : "", msg.from?.last_name != null ? msg.from?.last_name : "");
            const exist = await user.loadData();
            if(!exist) {
                if(msg.text == null || !msg.text.includes("/start")){
                    return;
                }
            }

            if(user.getCurrentStage() === "welcome_enter_name") {
                if(msg?.text == null){
                    return;
                }
                if(!(/^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/).test(msg.text)) {
                    const keyboard = await user.buildKeyboard('cancel',{"welcomeCancel": [user.getCurrentStage()]});
                    await user.sendMessage("text_error_welcome_name", {
                        reply_markup: {...keyboard}
                    })
                    return;
                }
                const [firstName, lastName] = msg.text.split(" ");
                user.cleanStaticData()
                const keyboard = await user.buildKeyboard('welcome_sex',{
                    "welcomeCancel": [user.getCurrentStage()],
                    "welcomeSexMale": [firstName, lastName],
                    "welcomeSexFemale": [firstName, lastName]
                });
                await user.sendMessage("text_welcome_enter_sex", {
                    reply_markup: {...keyboard}
                })

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