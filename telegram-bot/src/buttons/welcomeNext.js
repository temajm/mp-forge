import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

export default class buttonWelcomeNext extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {

    }
}