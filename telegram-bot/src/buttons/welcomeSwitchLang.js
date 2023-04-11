import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"
import {IsValidLang} from "../utils.js";

export default class buttonWelcomeSwitchLang extends Button {
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async (user, msg, args) => {
        console.log(`run ${JSON.stringify(args)}`);
        if (!Array.isArray(args) || args.length !== 2 || !IsValidLang(args[1])) {
            return;
        }

        await user.setLang(args[1]);
        const keyboard = await user.buildKeyboard('welcome', {"welcomeswitchlang": [user.lang === "ru" ? "en" : "ru"]});
        await user.getCurrentMessage().edit("text_welcome", keyboard)
    }
}