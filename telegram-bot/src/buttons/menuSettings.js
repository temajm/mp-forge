import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

export default class buttonWelcomeCancel extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {
        if(user.role !== 1){
            return;
        }
        if(args[1] === "select_lang") {
            if(args.length === 2){
                const keyboard = await user.buildKeyboard('menu_settings_select_lang');
                await user.getCurrentMessage().edit("text_settings_select_lang", keyboard)
                return;
            }
            if(args.length === 3){
                await user.setLang(args[2]);
                const keyboard = await user.buildKeyboard('menu_settings');
                await user.getCurrentMessage().edit("text_settings", keyboard)
            }
            return;
        }

        const keyboard = await user.buildKeyboard('menu_settings');
        await user.getCurrentMessage().edit("text_settings", keyboard)
    }
}