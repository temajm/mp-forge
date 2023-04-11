import Command from "../components/command.js";
import Core from "../core/core.js";

export default class commandTest extends Command{
    constructor(name, description) {
        super(name, description);
    }

    run = (msg) => {
        const user = Core.createUser(msg.from.id, msg.chat.id);
        user.loadData().then(() => {
            user.getText("text_welcome").then((data)=>{
                user.getChat().sendMessage(data, {
                    reply_markup: {...Core.Keyboards.build('general')},
                    parse_mode: "html"
                });
            })
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