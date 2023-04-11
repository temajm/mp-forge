import Core from "../core/core.js"
import Chat from "./chat.js";
import Telegram from "../core/telegram.js";
import LogSystem from "../core/logSystem.js";

class User {
    id = undefined;
    firstName = undefined;
    lastName = undefined;
    fatherName = undefined;
    chat = undefined;
    lang = undefined;

    constructor(user_id,
                chat_id = undefined) {
        this.id = user_id;
        if(chat_id !== undefined){
            this.chat = new Chat(chat_id);
        }
    }

    getChat = () => {
        return this.chat;
    }

    getText = (title) => {
        return new Promise((resolve, reject) => {
            Core.DatabaseManager.getFormattedStringByTitle(title, this.lang).then((data) => {
                console.log(data);
                if(data == null || data.length === 0){
                    LogSystem.error(`Not found text title ${title} (lang: ${this.lang})`)
                    reject();
                    return;
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
                        case "user.lastName":
                            return this.lastName;
                        default:
                            return `{${command}}`;
                    }
                });
                resolve(strF);
            });
        })
    }

    sendMessage = (text, options) => {
        if(this.getChat()){
            return this.getChat().sendMessage(text, options)
        }

        return Telegram.get().sendMessage(this.id, text, options).catch(LogSystem.error);
    }

    #register = () => {
        return Core.DatabaseManager.addUser(this.id);
    }

    loadData = () => {
        return new Promise((resolve, reject) => {
            Core.DatabaseManager.searchUserById(this.id).then((data) => {
                if(data.length === 0) {
                    this.#register().then(()=>{
                        this.loadData();
                    })
                    return;
                }
                data = data[0]
                for (const dataKey in data) {
                    this[dataKey] = data[dataKey];
                }
                resolve();
            });
        })
    }


}

export default User;