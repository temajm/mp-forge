import Telegram from "./telegram.js";
import Core from "./core.js"
import LogSystem from "./logSystem.js";

export default class Buttons {

    static _btnInstances = [];
    static isLoaded = false;

    static callEvent = (msg) => {
        if(msg?.data == null && typeof msg?.data !== "string") {
            return;
        }
        const data = msg.data.toLowerCase().split(" ");
        for (let i = 0; i < Buttons._btnInstances.length; i++) {
            const btn = Buttons._btnInstances[i];
            console.log(btn);
            if(btn.getCallbackData() === data[0]) {
                btn.run(msg);
                return;
            }
        }
    }

    static loadListener = () => {
        return new Promise((resolve, reject) => {
            const keyboardNames = [];

            for (const button in Core.Config.keyboards.list) {
                keyboardNames.push(button);
            }

            const registerListener = () => {
                Buttons.isLoaded = true;

                resolve();
            }
            const loadButton = (id = 0) => {
                if(id >= keyboardNames.length){
                    registerListener();
                    return;
                }
                const keyboard = Core.Config.keyboards.list[keyboardNames[id]];
                for (let i = 0; i < keyboard.buttons.length; i++) {
                    const lineButtons = keyboard.buttons[i];
                    for (let j = 0; j < lineButtons.length; j++) {
                        const btn = lineButtons[j];
                        if(btn?.callback_data == null){
                            continue;
                        }

                        import(`../buttons/${btn.callback_data}.js`).then((data) => {
                            const cmdInstance = new data.default(btn.text, btn.callback_data.toLowerCase());
                            if(cmdInstance?.run == null) { // check validate
                                LogSystem.error(`Button ${btn.callback_data} is invalid (not found run method)!`);
                                loadButton(id + 1);
                                return;
                            }

                            Buttons._btnInstances.push(cmdInstance);
                            loadButton(id + 1);
                        }).catch(LogSystem.error);
                    }
                }
            }
            loadButton();
        })
    }
}