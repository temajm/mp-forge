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

    static connect = async() => {
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

    static setUserLang = (user_id, lang) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('UPDATE `users` SET `lang` = ? WHERE `id` = ?', [lang, user_id], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

    static removeLangText = (title) => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('DELETE FROM `languages` WHERE `title` = ?', [title], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        });
    }

    static addLangText = (title, ru, en) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('INSERT INTO `languages` (`id`, `title`, `text`, `lang`, `isSystem`) VALUES (NULL, ?, ?, \'ru\', \'0\')', [title, ru], (error, results, fields) => {
                DatabaseManager.mysqlConnection.query('INSERT INTO `languages` (`id`, `title`, `text`, `lang`, `isSystem`) VALUES (NULL, ?, ?, \'en\', \'0\')', [title, en], (error, results, fields) => {
                    this.#handleData(resolve, reject, error, results, fields);
                })
            })
        }))
    }

    static getFAQAll = () => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `FAQ`', [], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        })
    }

    static findLangTextByTitle = (title) => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `languages` WHERE `title` = ?', [title], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        })
    }

    static setLangText = (title, ru, en) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('UPDATE `languages` SET `text` = ? WHERE `lang` = \'ru\' AND `title` = ?', [ru, title], (error, results, fields) => {
                DatabaseManager.mysqlConnection.query('UPDATE `languages` SET `text` = ? WHERE `lang` = \'en\' AND `title` = ?', [en, title], (error, results, fields) => {
                    this.#handleData(resolve, reject, error, results, fields);
                })
            })
        }))
    }

    static getLangTexts = () => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `languages`', [], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

    static getFormattedStringByTitle = (title, lang) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `languages` WHERE `lang` = ? AND `title` = ?', [lang, title], (error, results, fields) => {
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