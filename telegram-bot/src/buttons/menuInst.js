import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

export default class buttonMenuInst extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {
        if(user.role !== 1){
            return;
        }

        const getInsts = async(offset = 0) => {
            let gText = await user.getText("text_inst");
            let gTextWordQ = await user.getText("text_inst_word_question");
            let insts = await Core.DatabaseManager.getInstList(offset, user.divisionId);
            const keyboard = {
                "inline_keyboard": [

                ]
            }

            gText = `${gText}\n\n`
            for (let i = 0; i < insts.length; i++) {
                let gTextInst = await user.getText(insts[i].title);
                gText = `${gText}${i !== 0 ? "\n\n" : ""}${gTextWordQ} №${offset + i + 1}: ${gTextInst}`
                keyboard.inline_keyboard.push([
                    {"text": `${gTextWordQ} №${offset + i + 1}`, callback_data: `menuInst open ${offset} ${i}`}
                ])
            }

            const ctrl = [];
            let countInstsAll = (await Core.DatabaseManager.getInstsListCount(user.divisionId))[0].count;
            if(offset !== 0){
                ctrl.push({"text": `<<`, callback_data: `menuFaq prev ${offset}`})
            }
            if(offset + 6 < countInstsAll){
                ctrl.push({"text": `>>`, callback_data: `menuFaq next ${offset}`})
            }
            keyboard.inline_keyboard.push(ctrl)
            let gTextBack = await user.getText("button_back")
            keyboard.inline_keyboard.push([
                {"text": gTextBack, callback_data: `back text_menu menu`},
            ])

            await user.getCurrentMessage().editNative(gText, keyboard)
        }
        if(args.length === 4){
            if(args[1] === "open"){
                let instList = await Core.DatabaseManager.getInstList(parseInt(args[2]), user.divisionId);
                let element = instList[parseInt(args[3])]
                if(element == null){
                    return;
                }

                let gTextT = await user.getText(element.title);
                let gTextC = await user.getText(element.content);

                const keyboard = {
                    "inline_keyboard": [

                    ]
                }

                let gTextBack = await user.getText("button_back")
                keyboard.inline_keyboard.push([
                    {"text": gTextBack, callback_data: `menuInst set ${args[2]}`},
                ])

                let text = `<b>${gTextT}</b>\n\n${gTextC}`;
                await user.getCurrentMessage().editNative(text, keyboard)
                return;
            }
        }
        if(args.length === 3){
            if(args[1] === "next"){
                await getInsts(parseInt(args[2]) + 6)
                return;
            }
            if(args[1] === "prev"){
                await getInsts(parseInt(args[2]) - 6)
                return;
            }
            if(args[1] === "set"){
                await getInsts(parseInt(args[2]))
                return;
            }
        }
        getInsts()

    }
}