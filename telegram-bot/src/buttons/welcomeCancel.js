import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

export default class buttonWelcomeCancel extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {
        if(user.role !== 0 || args.length !== 2){
            return;
        }
        if(user.getCurrentStage() !== args[1]){
            return;
        }
        user.cleanStaticData();
        const keyboard = await user.buildKeyboard('welcome',{"welcomeswitchlang": [user.lang === "ru" ? "en" : "ru"]});
        await user.getCurrentMessage().edit("text_welcome", keyboard)
    }
}