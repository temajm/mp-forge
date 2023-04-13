import "./DivisionsPanel.scss"

import React from "react";

import {Button, Input, Space, Collapse, Form, Skeleton, Popconfirm, theme, Select } from "antd"
import {
    SearchOutlined,
    RedoOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import WebApi from "../helpers/WebApi";

export default class DivisionsPanel extends React.Component {

    dataList = [];

    constructor(props) {
        super(props);

        this.state = {
            waitLoadingData: true,
            blockRequests: false,
            textsList: [],
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
            langTextsList: [],
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({
                waitLoadingData: true,
                collapseActiveKey: null,
                textsList: [],
                langTextsList: [],
            }
        )
        WebApi.getFAQContent().then((data) => {
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
        WebApi.getLangTextsList().then((langs) => {
            let texts = {};

            for (let i = 0; i < langs.length; i++) {
                let element = langs[i];

                if (texts[element.title] == null) {
                    texts[element.title] = {}
                }
                texts[element.title][element.lang] = element.text;
                texts[element.title].isSystem = element.isSystem;
            }
            this.setState({
                textsList: data,
                waitLoadingData: false,
                langTextsList: texts
            })
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

    render() {
        let collapseList = [];
        if (this.state.waitLoadingData) {
            for (let i = 0; i < 5; i++) {
                collapseList.push(<Collapse.Panel disabled={true} header={<Skeleton.Button shape={"round"} block={true}
                                                                                           style={{width: "100%"}}/>}> </Collapse.Panel>)
            }
        } else {
            let index = 0;
            const langNames = [];
            for (const title in this.state.langTextsList) {
                langNames.push({value: title, label: this.state.langTextsList[title]?.ru ? this.state.langTextsList[title]?.ru : title})
            }
            if (this.state.isAddedNewTextMode) {
                collapseList.push(<Collapse.Panel header={<div><ClockCircleOutlined

                    style={{marginRight: '10px', color: theme.defaultConfig.token.colorInfo}}/>{this.state.createInputs.q?.length > 0 ? this.state.langTextsList[this.state.createInputs.q]?.ru : "..."}</div>} key={'create'}>
                    <Form
                        layout={"vertical"}
                    >
                        <Form.Item label="Вопрос:"
                                   tooltip="Напишите псевдоназвание текста вопроса (из языкового пакета)">
                            <Select options={langNames} showSearch status={this.state.stateCreateInputs.q} style={{fontSize: 16}} value={this.state.createInputs.q} onChange={(e) => {
                                console.log(e)

                                this.state.createInputs.q = e;
                                this.state.stateCreateInputs.q = "";
                                this.setState({
                                    createInputs: this.state.createInputs,
                                    stateCreateInputs: this.state.stateCreateInputs
                                })
                            }} placeholder="Выберите псевдоназвание текста вопроса"/>
                        </Form.Item>
                        <Form.Item label="Ответ:"
                                   tooltip="Напишите псевдоназвание текста ответа (из языкового пакета)">
                            <Select options={langNames} showSearch status={this.state.stateCreateInputs.a} style={{fontSize: 16}} value={this.state.createInputs.a} onChange={(e) => {
                                this.state.createInputs.a = e;
                                this.state.stateCreateInputs.a = ""
                                this.setState({
                                    createInputs: this.state.createInputs,
                                    stateCreateInputs: this.state.stateCreateInputs
                                })
                            }} placeholder="Выберите псевдоназвание текста ответа"/>
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
                                    if(this.state.createInputs?.q == null || this.state.createInputs.q?.length == 0){
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
                                    if(this.state.createInputs?.a == null || this.state.createInputs.a?.length == 0){
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
                                    WebApi.addFAQContent(this.state.createInputs.q, this.state.createInputs.a).then(()=>{
                                        this.props.apiNotification.success({
                                            message: "Успешно создали вопрос-ответ",
                                            description: `Вы успешно создали вопрос-ответ: ${this.state.createInputs.q}`
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
                                            message: "Невозможно создать вопрос-ответ",
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
            for (let i = 0; i < this.state.textsList.length; i++) {
                let element = this.state.textsList[i];
                if(!this.state.isAddedNewTextMode || this.state.searchText.length > 0){
                    let searchText = this.state.searchText.toLowerCase();
                    let isFounded = false;
                    if(this.state.langTextsList[element?.question]?.ru){
                        isFounded |= this.state.langTextsList[element?.question]?.ru.toLowerCase()?.includes(searchText)
                    }
                    if(this.state.langTextsList[element?.answer]?.ru){
                        isFounded |= this.state.langTextsList[element?.answer]?.ru.toLowerCase()?.includes(searchText)
                    }
                    isFounded |= element?.question?.toLowerCase()?.includes(searchText)
                    isFounded |= element?.answer?.toLowerCase()?.includes(searchText)
                    if(!isFounded) continue;
                }
                collapseList.push(<Collapse.Panel disabled={this.state.isAddedNewTextMode}
                                                  header={<div>{this.state.langTextsList[element.question] != null ? this.state.langTextsList[element.question]?.ru != null ? this.state.langTextsList[element.question].ru : element.question : element.question}</div>} key={i}>
                    <Form
                        layout={"vertical"}
                    >
                        <Form.Item label="Вопрос:"
                                   tooltip="Напишите псевдоназвание текста вопроса (из языкового пакета)">
                            <Select options={langNames} showSearch style={{fontSize: 16}} disabled={element?.question === undefined}
                                    value={element?.question != null ? element.question : ""} onChange={(e) => {
                                element.question = e;
                                this.setState({textsList: this.state.textsList})
                            }} rows={3} placeholder="Выберите псевдоназвание текста вопроса"/>
                        </Form.Item>
                        <Form.Item label="Ответ:"
                                   tooltip="Напишите псевдоназвание текста ответа (из языкового пакета)">
                            <Select options={langNames} showSearch style={{fontSize: 16}} disabled={element?.answer === undefined}
                                    value={element?.answer != null ? element.answer : ""} onChange={(e) => {
                                element.answer = e;
                                this.setState({textsList: this.state.textsList})
                            }} rows={6} placeholder="Выберите псевдоназвание текста ответа"/>
                        </Form.Item>
                        <Form.Item style={{display: "flex", justifyContent: "right"}}>
                            <Popconfirm
                                title="Удалить вопрос-ответ"
                                description="Вы точно желаете удалить данный вопрос-ответ?"
                                okText={"Да"}
                                cancelText={"Нет"}
                                disabled={this.state.blockRequests}
                                onConfirm={() => {
                                    this.setState({
                                        blockRequests: true
                                    })
                                    WebApi.removeFAQContent(element.id).then((data) => {
                                        this.props.apiNotification.success({
                                            message: "Успешно удалили вопрос-ответ",
                                            description: `Вы успешно удалили вопрос-ответ: ${this.state.langTextsList[element.question]?.ru}`
                                        })
                                        this.setState({
                                            blockRequests: false
                                        })
                                        this.loadData();
                                    }).catch((data) => {
                                        this.props.apiNotification.error({
                                            message: "Невозможно создать вопрос-ответ",
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
                                <Button disabled={this.state.blockRequests} danger
                                        htmlType="submit">
                                    Удалить
                                </Button>
                            </Popconfirm>
                            <Button disabled={this.state.blockRequests} ghost type="primary"
                                    style={{marginLeft: '16px'}} onClick={(e) => {
                                WebApi.setFAQContent(element.id, element.question, element.answer).then(() => {
                                    this.setState({blockRequests: false})
                                    this.props.apiNotification.success({
                                        message: "Успешно обновили вопрос-ответ",
                                        description: `Вы успешно обновили вопрос-ответ: ${this.state.langTextsList[element.question]?.ru}`
                                    })
                                }).catch((data) => {
                                    this.setState({blockRequests: false})
                                    this.props.apiNotification.error({
                                        message: "Невозможно загрузить данные",
                                        description: `Произошла ошибка: ${JSON.stringify(data)}`
                                    })
                                })
                            }}>
                                Обновить
                            </Button>
                        </Form.Item>
                    </Form>
                </Collapse.Panel>)
            }
        }
        return (
            <div className={"LangPanel"} key={"LangPanel"}>
                <Space size={"middle"} direction="vertical" style={{width: '100%'}}>
                    <div className={"header"}>
                        <div className={"title"}>Список подразделений:</div>
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
                        }}>{this.state.isAddedNewTextMode ? "Отмена" : "Добавить подразделение"}</Button>
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