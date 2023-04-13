import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

export default class buttonWelcomeNext extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {
        if(user.role !== 1){
            return;
        }
        const setFaqList = async(offset = 0) => {
            let gText = await user.getText("text_faq");
            let gTextWordQ = await user.getText("text_faq_word_question");
            let faqList = await Core.DatabaseManager.getFAQListByOffset(offset);
            const keyboard = {
                "inline_keyboard": [

                ]
            }

            gText = `${gText}\n\n`
            for (let i = 0; i < faqList.length; i++) {
                let gTextFaq = await user.getText(faqList[i].question);
                gText = `${gText}${i !== 0 ? "\n\n" : ""}${gTextWordQ} №${offset + i + 1}: ${gTextFaq}`
                keyboard.inline_keyboard.push([
                    {"text": `${gTextWordQ} №${offset + i + 1}`, callback_data: `menuFaq open ${offset} ${i}`}
                ])
            }
            let ctrl = [];
            let countFAQAll = (await Core.DatabaseManager.getFAQListCount())[0].count;

            if(offset !== 0){
                ctrl.push({"text": `<<`, callback_data: `menuFaq prev ${offset}`})
            }
            if(offset + 6 < countFAQAll){
                ctrl.push({"text": `>>`, callback_data: `menuFaq next ${offset}`})
            }

            keyboard.inline_keyboard.push(ctrl)
            let gTextBack = await user.getText("button_back")
            keyboard.inline_keyboard.push([
                {"text": gTextBack, callback_data: `back text_menu menu`},
            ])

            await user.getCurrentMessage().editNative(gText, keyboard)
        }
        console.log(args);
        if(args.length === 4){
            if(args[1] === "open"){
                let faqList = await Core.DatabaseManager.getFAQListByOffset(parseInt(args[2]));
                let element = faqList[parseInt(args[3])]

                let gTextWordQ = await user.getText("text_faq_word_question");
                let gTextAnswer = await user.getText("text_faq_answer");

                let gTextQ = await user.getText(element.question);
                let gTextA = await user.getText(element.answer);

                const keyboard = {
                    "inline_keyboard": [

                    ]
                }

                let gTextBack = await user.getText("button_back")
                keyboard.inline_keyboard.push([
                    {"text": gTextBack, callback_data: `menuFaq set ${args[2]}`},
                ])

                let text = `${gTextWordQ} №${parseInt(args[2]) + parseInt(args[3]) + 1}: ${gTextQ}\n\n${gTextAnswer} ${gTextA}`;
                await user.getCurrentMessage().editNative(text, keyboard)
                return;
            }
        }
        if(args.length === 3){
            if(args[1] === "next"){
                await setFaqList(parseInt(args[2]) + 6)
                return;
            }
            if(args[1] === "prev"){
                await setFaqList(parseInt(args[2]) - 6)
                return;
            }
            if(args[1] === "set"){
                await setFaqList(parseInt(args[2]))
                return;
            }
        }

        await setFaqList();
    }
}