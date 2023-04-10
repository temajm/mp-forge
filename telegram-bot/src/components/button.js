export default class Command {

    text = undefined;
    callback_data = undefined;

    constructor(text, callback_data) {
        this.text = text;
        this.callback_data = callback_data;
    }

    getText = () => {
        return this.text;
    }
    getCallbackData = () => {
        return this.callback_data;
    }

    run = (msg) => {};

}