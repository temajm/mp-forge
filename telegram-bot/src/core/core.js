import DatabaseManager from "./databaseManager.js";
import LogSystem from "./logSystem.js"
import Config from "./config.js";
import User from "../components/user.js"
import Telegram from "./telegram.js";

export default class Core {
    static LogSystem = LogSystem;
    static Config = Config;
    static DatabaseManager = DatabaseManager;

    static createUser = (user_id) => {
        return new User(user_id);
    }

    static initialize = () => {
        return new Promise((resolve, reject) => {
            Config.loadData().then(()=>{
                DatabaseManager.set(
                    Config.database.host,
                    Config.database.username,
                    Config.database.password,
                    Config.database.databaseName
                )
                Telegram.set(
                    Config.telegram.token,
                    {
                        polling: true
                    }
                );
                DatabaseManager.connect().then(() => {
                    LogSystem.log(`Database is connected!`, true);
                    resolve();
                })
            })
        })
    }
}