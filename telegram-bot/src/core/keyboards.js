import Core from "./core.js";
import {DeepCopy} from "../utils.js";
import LogSystem from "./logSystem.js";

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
    static build = (user = null, name, argsOfButton = null) => {
        return new Promise((resolve, reject) => {
            const keyboard = {};
            const keyboardInfo = Core.Config.keyboards.list[name];
            if(keyboardInfo == null){
                LogSystem.error(`Not founded keyboard: ${name}`)
                reject();
                return;
            }
            keyboard[keyboardInfo.type] = DeepCopy(keyboardInfo.buttons);

            const goLineKeyboard = (id = 0) => {
                if(id >= keyboard[keyboardInfo.type].length) {
                    resolve(keyboard);
                    return;
                }
                const btnLine = keyboard[keyboardInfo.type][id];
                const goBtn = (idBtn = 0) => {
                    if(idBtn >= btnLine.length) {
                        goLineKeyboard(id + 1)
                        return;
                    }

                    const btn = btnLine[idBtn];
                    let isDeletted = false;

                    const nextStage = () => {
                        if(typeof argsOfButton === "object") {
                            for (const argsOfButtonKey in argsOfButton) {
                                if (!Array.isArray(argsOfButton[argsOfButtonKey]) || argsOfButton[argsOfButtonKey].length === 0) {
                                    continue;
                                }
                                if((btn?.pseudo != null ? btn?.pseudo.toLowerCase() : btn?.callback_data.toLowerCase()) === argsOfButtonKey.toLowerCase()){
                                    if(argsOfButton[argsOfButtonKey].length > 0 && argsOfButton[argsOfButtonKey][0] === undefined){
                                        btnLine.splice(idBtn, 1);
                                        isDeletted = true;
                                        continue;
                                    }
                                    btn.callback_data = `${btn?.callback_data.split(" ")[0]} ${argsOfButton[argsOfButtonKey].join(" ")}`
                                    break;
                                }
                            }
                        }
                        goBtn(idBtn + (isDeletted ? 0 : 1));
                    }

                    if(btn?.text && user != null && !isDeletted){
                        const text = btn.text.toLowerCase();
                        user.getText(text).then((data)=>{
                            btn.text = data;
                            nextStage();
                        })
                    }else{
                        nextStage();
                    }

                }
                goBtn()
            }
            goLineKeyboard()
        })
    }
}