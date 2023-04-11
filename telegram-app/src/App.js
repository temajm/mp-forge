import React from "react"
import { Input, theme, ConfigProvider, Card } from "antd"
import './App.scss';
import TextField  from '@mui/material/TextField';
import NavigatorComponent from "./components/Navigator";
import NavigatorElement from "./components/NavigatorElement";
import FormError from "./forms/FormError";
import FormCreateCompany from "./forms/FormCreateCompany";
import { io } from "socket.io-client"

const Telegram = window.Telegram.WebApp

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activePanel: ''
        }
        let socket = io.connect("http://127.0.0.1:3003", {
            secure: true,
            transports: ["websocket"]
        })
        console.log(socket)
    }


    render() {
        console.log(Telegram)
        return (
            <div className="App">
                <ConfigProvider
                    theme={
                        Telegram.themeParams.text_color
                            ? {
                                algorithm:
                                    Telegram.colorScheme === 'dark'
                                        ? theme.darkAlgorithm
                                        : theme.defaultAlgorithm,
                                token: {
                                    colorText: Telegram.themeParams.text_color,
                                    colorPrimary: Telegram.themeParams.button_color,
                                    colorBgBase: Telegram.themeParams.bg_color,
                                },
                            }
                            : undefined
                    }
                >
                  <NavigatorComponent activePanel={"createCompany"}>
                      <NavigatorElement panel={"createCompany"}>
                          <FormCreateCompany />
                      </NavigatorElement>
                      <NavigatorElement panel={"error404"}>
                          <FormError title={"Форма не найдена"} description={"Попробуйте повторить попытку позже"}/>
                      </NavigatorElement>
                  </NavigatorComponent>
                </ConfigProvider>
            </div>
        );
  }

}

export default App;
