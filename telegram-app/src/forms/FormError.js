import React from "react"

import sadEmoji from "../images/emoji/sadEmoji.png"
import "./FormError.scss"

export default class FormError extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"FormError"}>
                <img src={sadEmoji} />
                <div className={"title"}>Форма не найдена</div>
                <div className={"description"}>
                    Попробуйте повторить попытку позже
                </div>
            </div>
        )
    }

}