export default class LogSystem {

    static isDebugLog = true;

    static error = (text) => {
        console.error(text);
    }

    static warning = (text) => {

    }

    static log = (text, isDebugLog = false) => {
        console.log(text);
    }
}