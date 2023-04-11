import Core from "./core.js";
import {DeepCopy} from "../utils.js";

export default class Keyboards {

    static _keyboards_names = [];

    static load = () => {
        Keyboards._keyboards_names = [];
        for (const keyboardName in Core.Config.keyboards.list) {
            Keyboards._keyboards_names.push(keyboardName.toLowerCase());
        }
    }

    static getList = () => {
        return Keyboards._keyboards_names;
    }

    /*
    example argsOfButton: {"callback_dataButton1": [1, 2356]}
     */
    static build = (name, argsOfButton = null) => {
        const keyboard = {};
        const keyboardInfo = Core.Config.keyboards.list[name];
        keyboard[keyboardInfo.type] = DeepCopy(keyboardInfo.buttons);

        for (let i = 0; i < keyboard[keyboardInfo.type].length; i++) {
            const btnLine = keyboard[keyboardInfo.type][i];
            for (let j = 0; j < btnLine.length; j++) {
                const btn = btnLine[j];
                if(btn?.callback_data.toLowerCase() === argsOfButtonKey.toLowerCase()){
                    btn.callback_data = `${argsOfButtonKey} ${argsOfButton[argsOfButtonKey].join(" ")}`
                }

                if(typeof argsOfButton === "object") {
                    for (const argsOfButtonKey in argsOfButton) {
                        if (!Array.isArray(argsOfButton[argsOfButtonKey]) || argsOfButton[argsOfButtonKey].length === 0) {
                            continue;
                        }

                    }
                }

            }
        }

        if(typeof argsOfButton === "object"){
            for (const argsOfButtonKey in argsOfButton) {
                if(!Array.isArray(argsOfButton[argsOfButtonKey]) && argsOfButton[argsOfButtonKey].length > 0) {
                    continue;
                }
                for (let i = 0; i < keyboard[keyboardInfo.type].length; i++) {
                    const btnLine = keyboard[keyboardInfo.type][i];
                    for (let j = 0; j < btnLine.length; j++) {
                        const btn = btnLine[j];
                        if(btn?.callback_data.toLowerCase() === argsOfButtonKey.toLowerCase()){
                            btn.callback_data = `${argsOfButtonKey} ${argsOfButton[argsOfButtonKey].join(" ")}`
                        }
                    }
                }
            }
        }

        return keyboard;
    }
}