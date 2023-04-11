import Core from "./core/core.js"
(async() => {
    await Core.initialize()
    Core.LogSystem.log("Bot is started!")
})()