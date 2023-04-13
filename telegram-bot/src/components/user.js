import Core from "../core/core.js"
import Chat from "./chat.js";
import Telegram from "../core/telegram.js";
import LogSystem from "../core/logSystem.js";
import CurrentMessage from "./currentMessage.js";

class User {

    static __staticData = {};

    id = undefined;
    firstName = undefined;
    lastName = undefined;
    fatherName = undefined;
    lang = undefined;
    role = undefined;
    divisionId = undefined;
    isOld = undefined;

    _chat = undefined;
    _currentMessage = undefined;
    _exist = false;

    constructor(user_id,
                chat_id = undefined, firstName, lastName) {
        this.id = user_id;
        this.firstName = firstName;
        this.lastName = lastName;
        if(chat_id !== undefined){
            this._chat = new Chat(chat_id);
        }
    }

    getCurrentStage = () => {
        return User.__staticData[this.id]?.stage != null ? User.__staticData[this.id].stage : ""
    }

    setCurrentStage = (stage) => {
        if(User.__staticData[this.id] == null){
            User.__staticData[this.id] = {};
        }

        User.__staticData[this.id].stage = stage;
    }

    getCurrentDivision = async() => {
        if(this.divisionId === -1){
            return {};
        }
        return (await Core.DatabaseManager.findDivisionById(this.divisionId))[0];
    }

    cleanStaticData = () => {
        if(User.__staticData[this.id] == null){
            return false;
        }
        delete User.__staticData[this.id];

        return true;
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


    getText = async(title, isSys = false) => {
        const data = await Core.DatabaseManager.getFormattedStringByTitle(title, this.lang);
        if(data == null || data.length === 0){
            LogSystem.error(`Not found text title ${title} (lang: ${this.lang})`)
            return null;
        }
        let strF = data[0].text;
        let titleDiv,descriptionDiv, membersDiv  = "";
        if(!isSys){
            let div = await this.getCurrentDivision();
            titleDiv = await this.getText(div.title, true);
            descriptionDiv = await this.getText(div.description, true);
            let members = await Core.DatabaseManager.getDivisionMembers(this.divisionId);
            for (let i = 0; i < members.length; i++) {
                membersDiv = `${membersDiv}${i !== 0 ? "\n" : ""}${i + 1}. <a href="tg://user?id=${members[i].id}">${members[i].firstName} ${members[i].lastName}</a>`
            }
        }
        strF = strF.replace(/{([^}]*)}/g, (match, command) => {
            if(typeof command !== "string"){
                return `{${command}}`;
            }

            const args = command.toLowerCase().split(" ");
            if(args[0] === "user.id"){
                return this.id;
            }else if(args[0] === "user.firstname"){
                return this.firstName;
            }else if(args[0] === "user.lastname"){
                return this.lastName;
            }else if(args[0] === "user.lang") {
                return this.lang;
            }else if(args[0] === "user.div") {
                if(titleDiv){
                    return titleDiv
                }
            }else if(args[0] === "div.title") {
                if(titleDiv){
                    return titleDiv
                }
            }else if(args[0] === "div.description") {
                if(descriptionDiv){
                    return descriptionDiv
                }
            }else if(args[0] === "div.members") {
                if(membersDiv){
                    return membersDiv
                }
            }

            return `{${command}}`;
        });
        return strF;
    }

    getCurrentMessage = () => {
        return this._currentMessage;
    }

    sendMessageNative = async(text, options) => {
        const gText = text;

        if (this.getChat()) {
            return await this.getChat().sendMessage(gText, options)
        }

        return await Telegram.get().sendMessage(this.id, gText, options).catch(LogSystem.error);
    }

    sendMessage = async(text, options) => {
        options = {...options, parse_mode: 'html'}
        const gText = await this.getText(text);

        if (this.getChat()) {
            return await this.getChat().sendMessage(gText, options)
        }

        return await Telegram.get().sendMessage(this.id, gText, options).catch(LogSystem.error);
    }

    register = async(divisionId) => {
        await Core.DatabaseManager.addUser(this.id, this.firstName, this.lastName, divisionId);
    }

    isExist = () => {
        return this._exist;
    }

    loadData = async() => {
        let data = await Core.DatabaseManager.searchUserById(this.id);
        if(data.length === 0) {
            this._exist = false;
            return false;
        }

        data = data[0]
        for (const dataKey in data) {
            this[dataKey] = data[dataKey];
        }

        this._exist = true;
        return true;
    }


}

export default User;