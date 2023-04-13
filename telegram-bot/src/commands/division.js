import Command from "../components/command.js";
import Core from "../core/core.js";

export default class commandDivision extends Command{
    constructor(name, description) {
        super(name, description);
    }

    run = async(user, msg, args) => {
        if(user.role !== 1){
            return;
        }

        const keyboard = await user.buildKeyboard('menu_div');
        await user.sendMessage("text_division", {
            reply_markup: {...keyboard},
            parse_mode: 'html'
        })
    }
}