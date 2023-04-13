import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

const products = [
    {
        text: `text_products_1`,
        photo: `text_products_url_1`
    },
    {
        text: `text_products_1`,
        photo: `text_products_url_1`
    }
]

export default class buttonWelcomeCompany extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {
        if(user.role !== 1){
            return;
        }

        const sendProduct = async(id = 0, message_idPhoto = undefined, message_idCurrent = undefined) => {
            if(products[id] == null){
                return false;
            }
            let photoUrl = await user.getText(products[id].photo);
            if(message_idPhoto){
                await Core.Telegram.get().deleteMessage(user.id, message_idPhoto);
            }
            if(message_idCurrent){
                await Core.Telegram.get().deleteMessage(user.id, message_idCurrent);
            }

            let data = await Core.Telegram.get().sendPhoto(user.id, photoUrl);
            console.log(data);
            const keyboard = await user.buildKeyboard('menu_products', {
                menuCompanyProductsNext: id >= products.length-1 ? [undefined] : ["products", "next", id, data.message_id],
                menuCompanyProductsPrev: id === 0 ? [undefined] : ["products", "prev", id, data.message_id],
                menuCompanyProductsBack: ["products", "back", data.message_id],
            });

            await user.sendMessage(products[id].text, {
                reply_markup: keyboard
            })
            return true;
        }

        if(args[1] === "products"){
            if(args.length === 5){
                if(args[2] === "next"){
                    await sendProduct(parseInt(args[3]) + 1, parseInt(args[4]), msg.message.message_id);
                }else if(args[2] === "prev"){
                    await sendProduct(parseInt(args[3]) - 1, parseInt(args[4]), msg.message.message_id);
                }
                return;
            }
            if(args.length === 2){
                await sendProduct();
                const keyboard = await user.buildKeyboard('menu_company');
                await user.getCurrentMessage().edit("text_company", keyboard)
                return;
            }
            if(args.length === 4){
                if(args[2] === "back"){
                    await Core.Telegram.get().deleteMessage(user.id, parseInt(args[3]));
                    const keyboard = await user.buildKeyboard("menu_company");
                    await user.getCurrentMessage().edit("text_company", keyboard)
                }
            }
            return;
        }

        const keyboard = await user.buildKeyboard('menu_company');
        await user.getCurrentMessage().edit("text_company", keyboard)
    }
}