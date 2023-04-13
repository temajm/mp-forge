import Command from "../components/command.js";
import Core from "../core/core.js";

export default class commandStart extends Command{
    constructor(name, description) {
        super(name, description);
    }

    run = async(user, msg, args) => {
        if(user.role !== 1){
            return;
        }

        const keyboard = await user.buildKeyboard('menu');
        await user.sendMessage("text_menu", {
            reply_markup: {...keyboard},
            parse_mode: 'html'
        })
    }
}