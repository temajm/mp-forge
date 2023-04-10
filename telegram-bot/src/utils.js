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