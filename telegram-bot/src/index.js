import Core from "./core/core.js"

Core.initialize().then(() => {
    Core.createUser(0)
})