import { Server } from "socket.io";
import Client from "./client.js";

export default class WebSocket{

    /**
     * @type {Server}
     */
    static io = undefined;
    static users = {};
    static freeIndex = [];
    static relativeIndex = 0;

    static initialize = () => {
        WebSocket.io = new Server({
            origins: '*:*'
        });
        WebSocket.registerListener()
        WebSocket.io.listen(3003);
        console.log("started server on port 3003")
    }

    static getUser = (index) => {
        return WebSocket.users[index];
    }

    static removeUser = (index) => {
        if(WebSocket.users[index] == null) {
            return false;
        }

        delete WebSocket.users[index];
        WebSocket.freeIndex.push(index);

        return true;
    }

    static addUser = (clientio) => {
        let index = null;
        if(WebSocket.freeIndex.length > 0){
            index = WebSocket.freeIndex.splice(0, 1)[0];
        }else{
            index = WebSocket.relativeIndex;
            WebSocket.relativeIndex += 1
        }

        let client = new Client(index, clientio)
        WebSocket.users[index] = client;

        return client;
    }

    static registerListener = () => {
        WebSocket.io.on("connection", (clientio) => {
            WebSocket.addUser(clientio);
        })
    }
}