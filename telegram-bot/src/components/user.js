import Core from "../core/core.js"
import Chat from "./chat.js";

class User {

    id = undefined;
    chat = undefined;

    constructor(user_id,
                chat_id = undefined) {
        this.id = user_id;
        if(chat_id !== undefined){
            this.chat = new Chat(chat_id);
        }

        this.#loadData();
    }

    getChat = () => {
        return this.chat;
    }

    #register = () => {
        return Core.DatabaseManager.addUser(this.id);
    }

    #loadData = () => {
        Core.DatabaseManager.searchUserById(this.id).then((data) => {
            if(data.length === 0) {
                this.#register().then(()=>{
                    this.#loadData();
                })
                return;
            }

            for (const dataKey in data) {
                this[dataKey] = data;
            }
        });
    }


}

export default User;