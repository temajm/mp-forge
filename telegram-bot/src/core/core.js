import DatabaseManager from "./databaseManager.js";
import LogSystem from "./logSystem.js"
import Config from "./config.js";
import User from "../components/user.js"
import Telegram from "./telegram.js";
import Commands from "./commands.js";
import Buttons from "./buttons.js";
import Keyboards from "./keyboards.js";
import Socket from "../webApi/socket.js";
import Web from "../webApi/web.js";

export default class Core {
    static LogSystem = LogSystem;
    static Config = Config;
    static DatabaseManager = DatabaseManager;
    static Keyboards = Keyboards;
    static Telegram = Telegram;

    static createUser = (user_id, chat_id, first_name, last_name) => {
        return new User(user_id, chat_id, first_name, last_name);
    }

    static initialize = async() => {
        await Config.loadData();
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

        Keyboards.load();
        await DatabaseManager.connect()
        LogSystem.log(`Database is connected!`, true);
        await Commands.loadListener()
        await Buttons.loadListener()
        Telegram.registerListener();
        Web.initialize()
    }
}