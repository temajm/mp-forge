import Core from "../core/core.js"
import Chat from "./chat.js";
import Telegram from "../core/telegram.js";
import LogSystem from "../core/logSystem.js";
import CurrentMessage from "./currentMessage.js";

class User {
    id = undefined;
    firstName = undefined;
    lastName = undefined;
    fatherName = undefined;
    lang = undefined;
    currentMessage_id = undefined;
    currentMessage_date = undefined;

    _chat = undefined;
    _currentMessage = undefined;

    constructor(user_id,
                chat_id = undefined) {
        this.id = user_id;
        if(chat_id !== undefined){
            this._chat = new Chat(chat_id);
        }
    }

    getChat = () => {
        return this._chat;
    }

    setLang = async(lang) => {
        await Core.DatabaseManager.setUserLang(this.id, lang);
        this.lang = lang;
    }

    buildKeyboard = (name, argsOfButton = null) => {
        return Core.Keyboards.build(this, name, argsOfButton);
    }

    setCurrentMessage = (msg) => {
        this._currentMessage = new CurrentMessage(this, msg)
    }


    getText = async(title) => {
        const data = await Core.DatabaseManager.getFormattedStringByTitle(title, this.lang);
        if(data == null || data.length === 0){
            LogSystem.error(`Not found text title ${title} (lang: ${this.lang})`)
            return null;
        }
        const strF = data[0].text;
        strF.replace(/{([^}]*)}/g, (match, command) => {
            if(typeof command !== "string"){
                return `{${command}}`;
            }

            const args = command.toLowerCase().split(" ");
            switch (args[0]) {
                case "user.id":
                    return this.id;
                case "user.firstName":
                    return this.firstName;
                case "user.lastName":
                    return this.lastName;
                default:
                    return `{${command}}`;
            }
        });
        return strF;
    }

    getCurrentMessage = () => {
        return this._currentMessage;
    }

    sendMessage = async(text, options) => {
        const gText = await this.getText(text);
        let data = null;

        if (this.getChat()) {
            return await this.getChat().sendMessage(gText, options)
        }

        return await Telegram.get().sendMessage(this.id, gText, options).catch(LogSystem.error);
    }

    register = async() => {
        await Core.DatabaseManager.addUser(this.id);
    }

    loadData = async() => {
        let data = await Core.DatabaseManager.searchUserById(this.id);
        if(data.length === 0) {
            return false;
        }

        data = data[0]
        for (const dataKey in data) {
            this[dataKey] = data[dataKey];
        }
        return true;
    }


}

export default User;