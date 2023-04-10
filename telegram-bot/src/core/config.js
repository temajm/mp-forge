import fs from "fs"
import LogSystem from "./logSystem.js";

class ConfigFile {
    _src = undefined;
    _name = undefined;

    constructor(src, name) {
        this._src = src;
        this._name = name;
    }

    getName = () => {
        return this._name;
    }

    getPath = () => {
        return this._src;
    }
}

export default class Config {
    static _configFiles = [
        new ConfigFile(
            "../configs/database.json",
            "database"
        ),
        new ConfigFile(
            "../configs/telegram.json",
            "telegram"
        ),
        new ConfigFile(
            "../configs/commands.json",
            "commands"
        ),
        new ConfigFile(
            "../configs/keyboards.json",
            "keyboards"
        ),
    ];

    static loadData = () => {
        return new Promise((resolve, reject) => {
            const nextFile = (id = 0) => {
                if(id >= Config._configFiles.length) {
                    LogSystem.log(`Config is loaded!`, true);
                    resolve();
                    return;
                }

                const file = Config._configFiles[id];
                LogSystem.log(`Read file: ${file.getName()} (${id+1} / ${Config._configFiles.length})`, true);
                fs.readFile(file.getPath(), {}, (error, data) => {
                    if(error) {
                        LogSystem.error(error);
                        reject(error)
                        return;
                    }

                    this[file.getName()] = JSON.parse(data.toString());
                    nextFile(id + 1);
                })
            }
            nextFile();
        })
    }
}