import Command from "../components/command.js";
import Core from "../core/core.js";

export default class commandTest extends Command{
    constructor(name, description) {
        super(name, description);
    }

    run = (msg) => {
        const user = Core.createUser(msg.from.id, msg.chat.id);
        console.log(Core.Keyboards.build('general'))
        user.getChat().sendMessage("test", {
            reply_markup: {...Core.Keyboards.build('general')}
        });
    }
}