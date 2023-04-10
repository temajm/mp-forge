import Core from "../core/core.js"
import Chat from "./chat.js";

class User {

    user_id = undefined;
    chat = undefined;

    constructor(user_id,
                chat_id = undefined) {
        this.user_id = user_id;

        if(chat_id){
            this.chat = new Chat(chat_id)
        }

        this.#loadData();
    }

    getChat = () => {
        return this.chat;
    }

    #register = () => {

    }

    #loadData = () => {
        Core.DatabaseManager.searchUserById(this.user_id).then((data) => {
            if(data.length === 0) {
                this.#register();

            }
        });
    }


}

export default User;