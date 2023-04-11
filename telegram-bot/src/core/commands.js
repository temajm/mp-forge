import Telegram from "./telegram.js";
import Core from "./core.js"
import LogSystem from "./logSystem.js";

export default class Commands {

    static _cmdInstances = [];
    static isLoaded = false;

    static callEvent = (msg) => {
        if(!Commands.isLoaded){
            return;
        }

        if(msg?.text == null && typeof msg?.text !== "string") {
            return;
        }
        let args = msg.text.toLowerCase().split(" ");
        for (let i = 0; i < this._cmdInstances.length; i++) {
            const cmd = this._cmdInstances[i];
            if(cmd.getAbsoluteName() === args[0]) {
                cmd.run(msg);
                return;
            }
        }
    }

    static loadListener = () => {
        return new Promise((resolve, reject) => {
            const registerListener = () => {
                Telegram.get().setMyCommands(this._cmdInstances.map((value) => {
                    return {"command": value.getName(), "description": value.getDescription()}
                })).catch(LogSystem.error);
                Commands.isLoaded = true;

                resolve();
            }
            const loadCmd = (id = 0) => {
                if(id >= Core.Config.commands.list.length){
                    registerListener();
                    return;
                }
                const cmd = Core.Config.commands.list[id];
                import(`../commands/${cmd.name}.js`).then((data) => {
                    const cmdInstance = new data.default(cmd.name, cmd.description);
                    if(cmdInstance?.run == null) { // check validate
                        LogSystem.error(`Command ${cmd.name} is invalid (not found run method)!`);
                        loadCmd(id + 1);
                        return;
                    }

                    Commands._cmdInstances.push(cmdInstance);
                    loadCmd(id + 1);
                }).catch(LogSystem.error);
            }
            loadCmd();
        })
    }
}