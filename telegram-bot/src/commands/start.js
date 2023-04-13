import Command from "../components/command.js";
import Core from "../core/core.js";

export default class commandStart extends Command{
    constructor(name, description) {
        super(name, description);
    }

    run = async(user, msg, args) => {
        if(user.isExist()){
            if(user.role === 0){
                const keyboard = await user.buildKeyboard('welcome',{"welcomeswitchlang": [user.lang === "ru" ? "en" : "ru"]});
                await user.sendMessage("text_welcome", {
                    reply_markup: {...keyboard},
                    parse_mode: 'html'
                })
            }else{
                const keyboard = await user.buildKeyboard('menu');
                await user.sendMessage("text_menu", {
                    reply_markup: {...keyboard},
                    parse_mode: 'html'
                })
            }
            return;
        }
        if(args.length !== 2){
            return;
        }
        const inviteCode = args[1];
        const div = await Core.DatabaseManager.findDivisionByInviteCode(inviteCode);
        if(div.length === 0){
            await user.sendMessageNative("Ошибка: пригласительный код недействительный!");
            return;
        }
        await user.register(div[0].id);
        await user.loadData();
        const keyboard = await user.buildKeyboard('welcome',{"welcomeswitchlang": [user.lang === "ru" ? "en" : "ru"]});
        await user.sendMessage("text_welcome", {
            reply_markup: {...keyboard},
            parse_mode: 'html'
        })
        /*
        const keyboard = await user.buildKeyboard('welcome',{"welcomeswitchlang": [user.lang === "ru" ? "en" : "ru"]});
        await user.sendMessage("text_welcome", {
            reply_markup: {...keyboard},
            parse_mode: 'html'
        })
        await Core.Telegram.get().sendPhoto(user.id, "https://i.imgur.com/O8mSoFN.jpeg");*/
        /*
        console.log(Core.Keyboards.build('general'))
        user.getText("welcome_text").then((data)=>{
            user.getChat().sendMessage(data, {
                reply_markup: {...Core.Keyboards.build('general')},
                parse_mode: "html"
            });
        })*/
    }
}