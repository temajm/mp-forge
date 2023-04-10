import mysql from "mysql"
import LogSystem from "./logSystem.js"

export default class DatabaseManager {

    static mysqlConnection = undefined;

    static set = (host, user, password, database) => {
        DatabaseManager.mysqlConnection = mysql.createConnection({
            host     : host,
            user     : user,
            password : password,
            database : database
        });
    }

    static connect = () => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.connect((error) => {
                if(error) {
                    LogSystem.error(error.toString());
                    reject(error);
                    return;
                }

                resolve();
            });
        })
    }

    static disconnect = () => {
        DatabaseManager.mysqlConnection.end();
    }

    static #handleData = (resolve, reject, error, results, fields) => {
        if(error) {
            LogSystem.error(error.toString());
            reject(error);
            return;
        }

        resolve(results, fields);
    }

    static addUser = (user_id) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('INSERT INTO `users` (`id`) VALUES (\'?\')', [user_id], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

    static searchUserById = (user_id) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `users` WHERE `id` = ?', [user_id], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

}