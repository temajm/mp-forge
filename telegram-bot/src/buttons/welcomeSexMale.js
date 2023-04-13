import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

export default class buttonWelcomeMale extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {
        if(user.role !== 0){
            return;
        }
        if(args.length !== 3){
            return;
        }
        args = msg.data.split(" ");
        await Core.DatabaseManager.setUserDataById(user.id, args[1], args[2], "male");

        const keyboard = await user.buildKeyboard('menu');
        await user.sendMessage("text_menu", {
            reply_markup: {...keyboard},
        })
    }
}