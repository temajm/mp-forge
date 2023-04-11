import Command from "../components/command.js";
import Core from "../core/core.js";

export default class commandTest extends Command{
    constructor(name, description) {
        super(name, description);
    }

    run = async(user, msg, args) => {
        const keyboard = await user.buildKeyboard('welcome',{"welcomeswitchlang": [user.lang === "ru" ? "en" : "ru"]});
        await user.sendMessage("text_welcome", {
            reply_markup: {...keyboard}
        })
        /*
        console.log(Core.Keyboards.build('general'))
        user.getText("welcome_text").then((data)=>{
            user.getChat().sendMessage(data, {
                reply_markup: {...Core.Keyboards.build('general')},
                parse_mode: "html"
            });
        })*/
    }
}