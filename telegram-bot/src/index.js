import Core from "./core/core.js"

Core.initialize().then(() => {
    console.log(Core.DatabaseManager);
    Core.createUser(0)
})