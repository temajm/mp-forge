import "./FAQPanel.scss"

import React from "react";

import {Button, Input, Space, Collapse, Form, Skeleton, Popconfirm, theme} from "antd"
import {
    SearchOutlined,
    RedoOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import WebApi from "../helpers/WebApi";

export default class FAQPanel extends React.Component {

    dataList = [];

    constructor(props) {
        super(props);

        this.state = {
            waitLoadingData: true,
            blockRequests: false,
            textsList: {},
            collapseActiveKey: null,
            cacheCollapseActiveKey: null,
            isAddedNewTextMode: false,
            createInputs: {
                q: "",
                a: ""
            },
            stateCreateInputs: {
                q: "",
                a: ""
            },
            searchText: "",
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({
            waitLoadingData: true,
            collapseActiveKey: null,
            textsList: {}
        })
        WebApi.getFAQContent().then((data) => {
            console.log(data);
            this.updateDataList(data);

        }).catch((data) => {
            this.setState({
                waitLoadingData: false,
                collapseActiveKey: null
            })
            this.props.apiNotification.error({
                message: "Невозможно загрузить данные",
                description: `Произошла ошибка: ${JSON.stringify(data)}`
            })
        })
    }

    updateDataList = (data) => {
        this.dataList = data;
        this.setState({
            textsList: data,
            waitLoadingData: false
        })
    }

    render() {
        let collapseList = [];
        if (this.state.waitLoadingData) {
            for (let i = 0; i < 5; i++) {
                collapseList.push(<Collapse.Panel disabled={true} header={<Skeleton.Button shape={"round"} block={true}
                                                                                           style={{width: "100%"}}/>}> </Collapse.Panel>)
            }
        } else {
            let index = 0;
            if (this.state.isAddedNewTextMode) {
                collapseList.push(<Collapse.Panel header={<div><ClockCircleOutlined

                    style={{marginRight: '10px', color: theme.defaultConfig.token.colorInfo}}/>1234</div>} key={'create'}>
                    <Form
                        layout={"vertical"}
                    >
                        <Form.Item label="Вопрос:"
                                   tooltip="Напишите максимально понятно вопрос">
                            <Input.TextArea status={this.state.stateCreateInputs.q} style={{fontSize: 16}} value={this.state.createInputs.q} onChange={(e) => {
                                this.state.createInputs.q = e.target.value;
                                this.state.stateCreateInputs.q = "";
                                this.setState({
                                    createInputs: this.state.createInputs,
                                    stateCreateInputs: this.state.stateCreateInputs
                                })
                            }} rows={3} placeholder="Введите вопрос"/>
                        </Form.Item>
                        <Form.Item label="Ответ:"
                                   tooltip="Ответ на введенный вопрос">
                            <Input.TextArea status={this.state.stateCreateInputs.a} style={{fontSize: 16}} value={this.state.createInputs.a} onChange={(e) => {
                                this.state.createInputs.a = e.target.value;
                                this.state.stateCreateInputs.a = ""
                                this.setState({
                                    createInputs: this.state.createInputs,
                                    stateCreateInputs: this.state.stateCreateInputs
                                })
                            }} rows={6} placeholder="Введите ответ"/>
                        </Form.Item>
                        <Form.Item style={{display: "flex", justifyContent: "right"}}>
                            <Popconfirm
                                title="Создать вопрос-ответ"
                                description="Вы точно желаете создать вопрос-ответ?"
                                okText={"Да"}
                                cancelText={"Нет"}
                                disabled={this.state.blockRequests}
                                onConfirm={() => {
                                    console.log(this.state.createInputs.title?.length)
                                    if(this.state.createInputs.q?.length == 0){
                                        this.state.stateCreateInputs.q = "error";
                                        this.setState({
                                            stateCreateInputs: this.state.stateCreateInputs
                                        })
                                        this.props.apiNotification.error({
                                            message: "Невозможно создать вопрос-ответ",
                                            description: "Необходимо ввести вопрос"
                                        })
                                        return;
                                    }
                                    if(this.state.createInputs.a?.length == 0){
                                        this.state.stateCreateInputs.a = "error";
                                        this.setState({
                                            stateCreateInputs: this.state.stateCreateInputs
                                        })
                                        this.props.apiNotification.error({
                                            message: "Невозможно создать вопрос-ответ",
                                            description: "Необходимо ввести ответ"
                                        })
                                        return;
                                    }
                                    this.setState({
                                        blockRequests: true
                                    })
                                    WebApi.addLangText(this.state.createInputs.title, this.state.createInputs.ru, this.state.createInputs.en).then(()=>{
                                        this.props.apiNotification.success({
                                            message: "Успешно создали текст",
                                            description: `Вы успешно создали текст под названием: ${this.state.createInputs.title}`
                                        })
                                        this.setState({
                                            blockRequests: false,
                                            cacheCollapseActiveKey: null,
                                            collapseActiveKey: this.state.cacheCollapseActiveKey,
                                            isAddedNewTextMode: false
                                        })
                                        this.loadData();
                                    }).catch((data) => {
                                        this.props.apiNotification.error({
                                            message: "Невозможно создать текст",
                                            description: `Произошла ошибка: ${JSON.stringify(data)}`
                                        })
                                        this.setState({
                                            blockRequests: false
                                        })
                                    })
                                }}
                            >
                                <Button size={"large"} disabled={this.state.blockRequests} type={"primary"}
                                        htmlType="submit">
                                    Создать
                                </Button>
                            </Popconfirm>
                        </Form.Item>
                    </Form>
                </Collapse.Panel>);
            }
            for (const title in this.state.textsList) {
                let element = this.state.textsList[title];
                if(!this.state.isAddedNewTextMode || this.state.searchText.length > 0){
                    let searchText = this.state.searchText.toLowerCase();
                    let isFounded = false;
                    isFounded |= title.toLowerCase().includes(searchText)
                    isFounded |= element.ru.toLowerCase().includes(searchText)
                    isFounded |= element.en.toLowerCase().includes(searchText)
                    if(!isFounded) continue;
                }
                collapseList.push(<Collapse.Panel disabled={this.state.isAddedNewTextMode}
                                                  header={<div>{element?.isSystem ? <InfoCircleOutlined style={{
                                                      marginRight: '10px',
                                                      color: theme.defaultConfig.token.colorWarning
                                                  }}/> : null}{title}</div>} key={index}>
                    <Form
                        layout={"vertical"}
                    >
                        <Form.Item label="Русская версия текста:"
                                   tooltip="Введенный текст будет отображаться у пользователей, использующих русский языковый пакет">
                            <Input.TextArea style={{fontSize: 16}} disabled={element?.ru === undefined}
                                            value={element?.ru != null ? element.ru : ""} onChange={(e) => {
                                element.ru = e.target.value;
                                this.setState({textsList: this.state.textsList})
                            }} rows={6} placeholder="Русская версия текста"/>
                        </Form.Item>
                        <Form.Item label="Английская версия текста:"
                                   tooltip="Введенный текст будет отображаться у пользователей, использующих английский языковый пакет">
                            <Input.TextArea style={{fontSize: 16}} disabled={element?.en === undefined}
                                            value={element?.en != null ? element.en : ""} onChange={(e) => {
                                element.en = e.target.value;
                                this.setState({textsList: this.state.textsList})
                            }} rows={6} placeholder="Английская версия текста"/>
                        </Form.Item>
                        <Form.Item style={{display: "flex", justifyContent: "right"}}>
                            <Popconfirm
                                title="Удалить текст"
                                description="Вы точно желаете удалить данный текст?"
                                okText={"Да"}
                                cancelText={"Нет"}
                                disabled={this.state.blockRequests || element.isSystem}
                                onConfirm={() => {
                                    this.setState({
                                        blockRequests: true
                                    })
                                    WebApi.removeLangText(title).then((data) => {
                                        this.props.apiNotification.success({
                                            message: "Успешно удалили текст",
                                            description: `Вы успешно удалили текст под названием: ${title}`
                                        })
                                        this.setState({
                                            blockRequests: false
                                        })
                                        this.loadData();
                                    }).catch((data) => {
                                        this.props.apiNotification.error({
                                            message: "Невозможно создать текст",
                                            description: `Произошла ошибка: ${JSON.stringify(data)}`
                                        })
                                        this.setState({
                                            blockRequests: false
                                        })
                                    })
                                }}
                                icon={
                                    <QuestionCircleOutlined
                                        style={{
                                            color: 'red',
                                        }}
                                    />
                                }
                            >
                                <Button disabled={this.state.blockRequests || element.isSystem} danger
                                        htmlType="submit">
                                    Удалить
                                </Button>
                            </Popconfirm>
                            <Button disabled={this.state.blockRequests} ghost type="primary"
                                    style={{marginLeft: '16px'}} onClick={(e) => {
                                WebApi.setLangText(title, element.ru, element.en).then(() => {
                                    this.setState({blockRequests: false})
                                }).catch(() => {
                                    this.setState({blockRequests: false})
                                })
                            }}>
                                Обновить
                            </Button>
                        </Form.Item>
                    </Form>
                </Collapse.Panel>)
                index += 1;
            }
        }
        return (
            <div className={"LangPanel"} key={"LangPanel"}>
                <Space size={"middle"} direction="vertical" style={{width: '100%'}}>
                    <div className={"header"}>
                        <div className={"title"}>Список вопрос-ответов:</div>
                        <Button onClick={() => {
                            this.loadData();
                        }} disabled={this.state.waitLoadingData} type={"default"} style={{marginLeft: "auto"}}
                                size={"large"} icon={<RedoOutlined style={{transform: "rotate(-90deg)"}}/>}/>
                    </div>
                    <Space size={"large"} direction="vertical" style={{width: '100%'}}>
                        <Input suffix={<SearchOutlined
                            style={{
                                fontSize: 16,
                                color: this.state.searchText.length > 0 ? theme.defaultConfig.token.colorInfo : ''
                            }}
                            className={"searchIcon"}
                        />} disabled={this.state.waitLoadingData || this.state.isAddedNewTextMode} allowClear enterButton placeholder={"Поиск"}
                               size={"large"} onPressEnter={(e) => {
                            this.setState({
                                searchText: e.target.value
                            })
                        }} onChange={(e) => {
                            if(e.target.value?.length == 0 && this.state.searchText.length !== 0){
                                this.setState({
                                    searchText: ""
                                })
                            }
                        }}/>
                        <Button disabled={this.state.waitLoadingData} type={"primary"}
                                danger={this.state.isAddedNewTextMode} size={"large"} block onClick={() => {
                            if (this.state.isAddedNewTextMode) {
                                this.setState({
                                    cacheCollapseActiveKey: null,
                                    collapseActiveKey: this.state.cacheCollapseActiveKey,
                                    isAddedNewTextMode: false
                                })
                                return;
                            }
                            this.setState({
                                cacheCollapseActiveKey: this.state.collapseActiveKey,
                                collapseActiveKey: ['create'],
                                isAddedNewTextMode: true,
                                createInputs: {
                                    ru: "",
                                    en: "",
                                    title: ""
                                },
                                stateCreateInputs: {
                                    ru: "",
                                    en: "",
                                    title: ""
                                }
                            })
                        }}>{this.state.isAddedNewTextMode ? "Отмена" : "Добавить новый вопрос-ответ"}</Button>
                        <Collapse activeKey={this.state.collapseActiveKey} onChange={(e) => {
                            if (this.state.isAddedNewTextMode) {
                                return;
                            }
                            this.setState({collapseActiveKey: e});
                        }}>
                            {collapseList}
                        </Collapse>
                    </Space>
                </Space>
            </div>
        )
    }

}