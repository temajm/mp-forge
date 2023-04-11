import Telegram from "../core/telegram.js";

export default class CurrentMessage {
    message_id = undefined;
    user = undefined;

    constructor(user, message) {
        this.user = user;
        this.message = message;
    }

    checkValidate = async(message_text, reply_markup) => {
        const time = new Date().getTime() / 1000;

        if(time - this.message.date <= 60 * 60 * 23) {
            return true;
        }

        await this.user.sendMessage(message_text, {
            reply_markup: reply_markup
        })

        return false;
    }

    edit = async(message_text, reply_markup) => {
        let isValidate = await this.checkValidate(message_text, reply_markup);
        if(!isValidate) {
            return;
        }

        let gText = await this.user.getText(message_text)
        await Telegram.get().editMessageText(gText, {message_id: this.message.message_id, chat_id: this.message.chat.id} )
        await Telegram.get().editMessageReplyMarkup(reply_markup, {message_id: this.message.message_id, chat_id: this.message.chat.id} )
    }

    editText = async(message_text) => {
        let isValidate = await this.checkValidate(message_text, this.message.reply_markup);
        if(!isValidate) {
            return;
        }

        let gText = await this.user.getText(message_text)
        await Telegram.get().editMessageText(gText, {message_id: this.message.message_id, chat_id: this.message.chat.id} )
    }

    editMarkup = async(reply_markup) => {
        let isValidate = await this.checkValidate(this.message.text, this.message.reply_markup);
        if(!isValidate) {
            return;
        }

        await Telegram.get().editMessageReplyMarkup(reply_markup, {message_id: this.message.message_id, chat_id: this.message.chat.id} )
    }

}