export const DeepCopy = (obj) => {
    if (typeof obj !== 'object' || obj === null)  {
        return obj;
    }

    let outObj = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        outObj[key] = DeepCopy(obj[key]);
    }

    return outObj;
}

export const IsValidLang = (lang) => {
    const langs = ["ru", "en"];

    for (let i = 0; i < langs.length; i++) {
        if(langs[i] === lang) {
            return true;
        }
    }

    return false;
}