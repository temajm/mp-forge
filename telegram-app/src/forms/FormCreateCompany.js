import React from "react"
import {Card, ConfigProvider, Input, theme, Button} from "antd";

const Telegram = window.Telegram.WebApp

export default class FormCreateCompany extends React.Component {
    constructor(props) {
        super(props);

        Telegram.MainButton.text = "Зарегистрировать"
        Telegram.MainButton.color = "#42A5F5"
        //Telegram.MainButton.color = "#9E9E9E"
        Telegram.MainButton.disable();
        Telegram.MainButton.showProgress(false)
        Telegram.MainButton.show();
    }

    render() {
        return (
                <Card
                    title="Информация о компании"
                    bordered={false}
                    style={{
                        width: "100%",
                    }}
                >
                    <div className={"inputWrapper"}>
                        <div className={"header"}>Название:</div>
                        <Input size={"middle"} placeholder={"Введите название"} />
                    </div>

                    <div className={"inputWrapper"} style={{marginTop: "8px"}}>
                        <div className={"header"}>Краткое описание:</div>
                        <Input.TextArea size={"middle"} placeholder={"Введите краткое Описание"} rows={4} showCount maxLength={256} />
                    </div>

                </Card>
        )
    }

}