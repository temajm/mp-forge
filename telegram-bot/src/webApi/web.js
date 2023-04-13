import express from "express"
import cors from "cors"
import Core from "../core/core.js";

export default class Web {

    static _server = undefined;

    static initialize = () => {
        Web._server = express();
        Web._server.options('*', cors())
        Web._server.use(express.json())
        Web.registerListener();
        Web._server.listen(3003);
        Core.LogSystem.log("Started web server on port 3003")
    }

    static genError = (text) => {
        return {"response": {"status": "error", "error-text": text}}
    }

    static checkValidateParam = (res, param, type = []) => {
        let isFoundedType = false;
        if(res.req.body[param] == null && res.req.body[param] !== 0) {
            res.json(Web.genError(`Не найден параметр ${param}!`));
            return false;
        }
        for (let i = 0; i < type.length; i++) {
            let element = type[i];
            if(typeof res.req.body[param] === element){
                isFoundedType = true;
                break;
            }
        }
        if(!isFoundedType) {
            res.json(Web.genError(`Неправильный тип метода ${param} (Type: ${type.join(", ")})`));
            return false;
        }
        return true;
    }

    static registerListener = () => {
        Web._server.post("/api/",(req, res) => {
            console.log(req.body);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            if(!Web.checkValidateParam(res, "method", ["string"])) return;

            switch (req.body.method) {
                case "setFAQContent":
                    if(!Web.checkValidateParam(res, "id", ["number"])) return;
                    if(!Web.checkValidateParam(res, "question", ["string"])) return;
                    if(!Web.checkValidateParam(res, "answer", ["string"])) return;
                    Core.DatabaseManager.setFAQContentById(req.body.id, req.body.question, req.body.answer).then((data) => {
                        res.json({"response": {
                                status: "ok",
                            }});
                    }).catch((err) => {
                        res.json(Web.genError("Произошла ошибка!"));
                    });
                    break;
                case "removeFAQContent":
                    if(!Web.checkValidateParam(res, "id", ["number"])) return;

                    Core.DatabaseManager.getFAQContentById(req.body.id).then((data) => {
                        if(data.length === 0){
                            res.json(Web.genError(`Вопрос-ответ не найден под айди: ${req.body.id}!`));
                            return;
                        }
                        Core.DatabaseManager.removeFAQContentById(req.body.id).then((data) => {
                            res.json({"response": {
                                    status: "ok",
                                }});
                        }).catch((err) => {
                            res.json(Web.genError("Произошла ошибка!"));
                        });
                    }).catch((err) => {
                        res.json(Web.genError("Произошла ошибка!"));
                    });
                    break;
                case "addFAQContent":
                    if(!Web.checkValidateParam(res, "question", ["string"])) return;
                    if(!Web.checkValidateParam(res, "answer", ["string"])) return;

                    Core.DatabaseManager.addFAQContent(req.body.question, req.body.answer).then((data) => {
                        res.json({"response": {
                                status: "ok",
                                list: data
                            }});
                    }).catch((err) => {
                        res.json(Web.genError("Произошла ошибка!"));
                    });
                    break;
                case "getFAQContent":
                    Core.DatabaseManager.getFAQAll().then((data) => {
                        res.json({"response": {
                                status: "ok",
                                list: data
                            }});
                    }).catch((err) => {
                        res.json(Web.genError("Произошла ошибка!"));
                    });
                    break;
                case "getLangListPseudo":
                    Core.DatabaseManager.getLangListPseudo().then((data) => {
                        let arr = data.map((el) => {return el?.title});
                        let out = [];
                        for (let i = 0; i < arr.length; i++) {
                            let isFounded = false;
                            for (let j = 0; j < out.length; j++) {
                                if(out[j] === arr[i]){
                                    isFounded = true;
                                    break;
                                }
                            }

                            if(isFounded) continue;

                            out.push(arr[i])
                        }
                        res.json({"response": {
                                status: "ok",
                                list: out
                            }});
                    }).catch((err) => {
                        res.json(Web.genError("Произошла ошибка!"));
                    })
                    break;
                case "removeLangText":
                    if(!Web.checkValidateParam(res, "title", ["string"])) return;

                    Core.DatabaseManager.findLangTextByTitle(req.body.title).then((data) => {
                        if (data.length === 0) {
                            res.json(Web.genError("Текст с таким названием не существует!"));
                            return;
                        }
                        Core.DatabaseManager.removeLangText(req.body.title).then((results) => {
                            res.json({"response": {
                                    status: "ok"
                                }});
                        }).catch((err) => {
                            res.json(Web.genError("Произошла ошибка!"));
                        })
                    }).catch((err) => {
                        res.json(Web.genError("Произошла ошибка!"));
                    })
                    break;
                case "addLangText":
                    if(!Web.checkValidateParam(res, "title", ["string"])) return;
                    if(!Web.checkValidateParam(res, "ru", ["string"])) return;
                    if(!Web.checkValidateParam(res, "en", ["string"])) return;
                    Core.DatabaseManager.findLangTextByTitle(req.body.title).then((data) => {
                        if(data.length > 0){
                            res.json(Web.genError("Текст с таким названием уже существует!"));
                            return;
                        }

                        Core.DatabaseManager.addLangText(req.body.title, req.body.ru, req.body.en).then((results) => {
                            res.json({"response": {
                                    status: "ok"
                                }});
                        }).catch((err) => {
                            res.json(Web.genError("Произошла ошибка!"));
                        })
                    })
                    break;
                case "setLangText":
                    if(!Web.checkValidateParam(res, "title", ["string"])) return;
                    if(!Web.checkValidateParam(res, "ru", ["string"])) return;
                    if(!Web.checkValidateParam(res, "en", ["string"])) return;

                    Core.DatabaseManager.setLangText(req.body.title, req.body.ru, req.body.en).then((results) => {
                        res.json({"response": {
                                status: "ok"
                        }});
                    }).catch((err) => {
                        res.json(Web.genError("Произошла ошибка!"));
                    })
                    break;
                case "getLangTexts":
                    Core.DatabaseManager.getLangTexts().then((results) => {
                        res.json({"response": {
                            status: "ok",
                            list: results
                            }});
                    })
                    break;
                default:
                    res.json(Web.genError("Указанный метод не найден!"));
                    break;
            }
        })
    }
}