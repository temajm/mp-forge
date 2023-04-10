export default class Command {

    name = undefined;
    description = undefined;

    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    getName = () => {
        return this.name;
    }
    getAbsoluteName = () => {
        return `/${this.getName()}`
    }
    getDescription = () => {
        return this.description;
    }

    run = (msg) => {};

}