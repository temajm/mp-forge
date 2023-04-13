import mysql from "mysql"
import LogSystem from "./logSystem.js"

export default class DatabaseManager {

    static mysqlConnection = undefined;

    static set = (host, user, password, database) => {
        DatabaseManager.mysqlConnection = mysql.createConnection({
            host     : host,
            user     : user,
            password : password,
            database : database,
            charset : 'utf8mb4'
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

    static setUserDataById = (user_id, firstName, lastName, sex) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('UPDATE `users` SET `firstName` = ?, `lastName` = ?, `sex` = ?, `role` = 1 WHERE `id` = ?', [firstName, lastName, sex, user_id], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

    static addUser = (user_id, firstName, lastName, divisionId) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('INSERT INTO `users` (`id`, `firstName`, `lastName`, `divisionId`) VALUES (?, ?, ?, ?)', [user_id, firstName, lastName, divisionId], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

    static getFAQListCount = () => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT COUNT(*) as \'count\' FROM `faq`', [], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }
    static getFAQListByOffset = (offset = 0) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `faq` ORDER BY `id` ASC LIMIT ?, 6', [offset], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

    static findDivisionByInviteCode = (inviteCode) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `divisions` WHERE `inviteCode` = ?', [inviteCode], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

    static findDivisionById = (id) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `divisions` WHERE `id` = ?', [id], (error, results, fields) => {
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

    static getFAQContentById = (id) => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `faq` WHERE `id` = ?', [id], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        })
    }

    static removeFAQContentById = (id) => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('DELETE FROM `faq` WHERE `id` = ?', [id], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        })
    }

    static setFAQContentById = (id, question, answer) => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('UPDATE `faq` SET `question` = ?, `answer` = ? WHERE `id` = ?', [question, answer, id], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        })
    }

    static addFAQContent = (question, answer) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('INSERT INTO `faq` (`id`, `question`, `answer`) VALUES (NULL, ?, ?)', [question, answer], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        }))
    }

    static getFAQAll = () => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `faq`', [], (error, results, fields) => {
                this.#handleData(resolve, reject, error, results, fields);
            })
        })
    }

    static getLangListPseudo = () => {
        return new Promise((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT `title` FROM `languages`', [], (error, results, fields) => {
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

    static getDivisionMembers = (id) => {
        return new Promise(((resolve, reject) => {
            DatabaseManager.mysqlConnection.query('SELECT * FROM `users` WHERE `divisionId` = ? AND `role` = 1', [id], (error, results, fields) => {
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