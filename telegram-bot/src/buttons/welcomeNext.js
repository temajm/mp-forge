import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

export default class buttonWelcomeNext extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {
        if(user.role !== 0){
            return;
        }
        user.setCurrentStage("welcome_enter_name");
        const keyboard = await user.buildKeyboard('cancel',{"welcomeCancel": [user.getCurrentStage()]});
        await user.sendMessage("text_welcome_enter_name", {
            reply_markup: {...keyboard},
        })
    }
}