import axios from "axios"

export default class WebApi {

    static serverName = "http://127.0.0.1:3003/api/"

    static setLangText = (title, ru, en) => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "setLangText",
                title: title,
                ru: ru,
                en: en
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response);
            }).catch(reject)
        })
    }

    static removeLangText = (title) => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "removeLangText",
                title: title
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response);
            }).catch(reject)
        })
    }

    static setFAQContent = (id, question, answer) => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "setFAQContent",
                id: id,
                question: question,
                answer: answer
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response);
            }).catch(reject)
        })
    }

    static removeFAQContent = (id) => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "removeFAQContent",
                id: id,
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response);
            }).catch(reject)
        })
    }

    static addLangText = (title, ru, en) => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "addLangText",
                title: title,
                ru: ru,
                en: en
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response);
            }).catch(reject)
        })
    }


    static getLangListPseudo = () => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "getLangListPseudo",
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response);
            }).catch(reject)
        })
    }

    static addFAQContent = (question, answer) => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "addFAQContent",
                question: question,
                answer: answer
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response);
            }).catch(reject)
        })
    }

    static getFAQContent = () => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "getFAQContent"
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response?.list);
            }).catch(reject)
        })
    }

    static getLangTextsList = () => {
        return new Promise((resolve, reject) => {
            axios.post(WebApi.serverName, {
                method: "getLangTexts"
            }).then((data)=>{
                if(data.data?.response?.status !== "ok") {
                    reject(data.data.response);
                    return;
                }
                resolve(data.data.response?.list);
            }).catch(reject)
        })
    }
}