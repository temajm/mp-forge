import Command from "../components/command.js";
import Core from "../core/core.js";
import Button from "../components/button.js"

const products = [
    {
        text: `text_products_1`,
        photo: `text_products_url_1`
    }
]

export default class buttonWelcomeProductsNext extends Button{
    constructor(text, callback_data) {
        super(text, callback_data);
    }

    run = async(user, msg, args) => {
        if(user.role !== 1){
            return;
        }

        const sendProduct = async(id = 0) => {
            const keyboard = await user.buildKeyboard('menu_products', {
                menuCompanyProductsNext: [NaN]
            });
            await user.getCurrentMessage().edit("text_company", keyboard)
        }

        if(args[1] === "products"){
            if(args.length === 2){
                await sendProduct();
                const keyboard = await user.buildKeyboard('menu_company');
                await user.getCurrentMessage().edit("text_company", keyboard)
                return;
            }
            return;
        }

        const keyboard = await user.buildKeyboard('menu_company');
        await user.getCurrentMessage().edit("text_company", keyboard)
    }
}