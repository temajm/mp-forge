import { Socket } from "socket.io";
import WebSocket from "./socket.js";

export default class Client {
    telegram_id = undefined;

    id = undefined;
    /**
     * @type {Socket}
     */
    clientio = undefined;

    constructor(id, clientio) {
        this.id = id;
        this.clientio = clientio;

        this.registerListener();
    }

    getId = () => {
        return this.id;
    }

    send = (msg) => {
        this.clientio.emit("message", msg);
    }

    registerListener = () => {
        this.send({method: "auth"})
        this.clientio.on("disconnect", () => {
            WebSocket.removeUser(this.getId());
        })
    }
}