import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

export default class buttonTestCallback extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = (msg) => {
        console.log("run")
        console.log(msg);
        const user = Core.createUser(msg.from.id, msg.message.chat.id);
        user.getChat().sendMessage("ok", {
            reply_markup: {...Core.Keyboards.build('general', {
                    testCallback: [234, 1235]
                })}
        });
    }
}