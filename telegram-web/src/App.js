import './App.scss';
import React, {useEffect, useMemo, useState} from "react"
import Theme from "./helpers/Theme.js"
import {ConfigProvider, theme, Layout, Menu, notification, Button, Badge} from "antd"
import { BulbFilled, BulbOutlined, ExclamationCircleOutlined, FormOutlined, PieChartOutlined, UserOutlined, CommentOutlined, DesktopOutlined, BarChartOutlined, TeamOutlined, RobotFilled, WechatOutlined, QuestionCircleOutlined, DatabaseOutlined, NotificationOutlined, SettingOutlined } from '@ant-design/icons';
import GeneralPanel from "./panels/GeneralPanel";
import LangPanel from "./panels/LangPanel";

import axios from "axios"
import FAQPanel from "./panels/FAQPanel";
import DivisionsPanel from "./panels/DivisionsPanel";

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
/*
class App extends React.Component {

    token = undefined;

    constructor(props) {
        super(props);

        this.state = {
            collapsed: false,
            theme: "dark",
            selectedMenuItem: 'lang',
        }
        document.body.setAttribute("theme", this.state.theme === "light" ? "light" : "dark")
    }

    componentDidMount() {
        console.log()
    }

    toggleTheme = () => {
        const newTheme = this.state.theme === "light" ? "dark" : "light"
        this.setState({
            theme: newTheme
        })
        document.body.setAttribute("theme", newTheme)
    }

    onMenuButton = (key) => {
        if(key == 'theme'){
            this.toggleTheme();
        }
    }
  render() {
        const panels = {
            general: <GeneralPanel key={'2'}/>,
            lang: <LangPanel key={'1'} />
        }
      let currentPanel = panels.general;
      if(panels[this.state.selectedMenuItem] != null){
          currentPanel = panels[this.state.selectedMenuItem];
      }
      const items = [
          getItem('Главная', 'general', <DesktopOutlined />),
          getItem('Статистика', 'statics', <BarChartOutlined />),
          getItem('Языки', 'lang', <CommentOutlined />),
          getItem('Пользователи', 'users', <UserOutlined />),
          getItem('Подразделения', 'division', <TeamOutlined />),
          getItem('Задания', 'tasks', <DatabaseOutlined />),
          getItem('FAQ', 'FAQ', <QuestionCircleOutlined />),
          getItem('Уведомления', 'notifications', <NotificationOutlined />),
          getItem('Настройки', 'settings', <SettingOutlined />),
          getItem('Светлая тема', 'theme', this.state.theme === "light" ? <BulbFilled style={{color:  "#FFEB3B"}} /> : <BulbOutlined />),
      ];
    return (
        <div className="App">
            <ConfigProvider
                theme={{algorithm: this.state.theme === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm}}>
                <test />
                <Layout
                    style={{
                        minHeight: '100vh',
                    }}
                >
                    <Layout.Sider className={"mainMenu"} theme={"light"} collapsible collapsed={this.state.collapsed} onCollapse={(value) => this.setState({collapsed: value})}>
                        <div
                            className={`layout-header${this.state.collapsed ? " hidden" : ""}`}
                        >
                            <div className={"icon"}><RobotFilled /></div>
                            <div className={"content"}>Admin Panel</div>
                        </div>
                        <Menu theme="light" selectedKeys={this.state.selectedMenuItem} mode="inline" items={items} onSelect={(item) => {
                            this.onMenuButton(item.key)
                            if(item.key == 'theme'){
                                return;
                            }
                            this.setState({
                                selectedMenuItem: item.key
                            })
                        }} />
                    </Layout.Sider>
                    <Layout className="site-layout">
                        <Layout.Header
                            className={"mainHeader"}
                        >
                            Главная
                        </Layout.Header>
                        <Layout.Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 280,
                                background: theme.defaultConfig.token.colorBgContainer,
                            }}
                            className={"mainContent"}
                        >
                            {currentPanel}
                        </Layout.Content>
                        <Layout.Footer style={{ textAlign: 'center' }}>Команда "Интернет кузница" / "Internet Forge" (Code Rocks 2023)</Layout.Footer>
                    </Layout>
                </Layout>

            </ConfigProvider>
        </div>
    );
  }
}*/

const App = () => {
    const [collapsed, setCollapsed] = useState(window.innerWidth < 600);
    const [selectedTheme, setSelectedTheme] = useState("dark");
    const [selectedMenuItem, setSelectedMenuItem] = useState('general');

    const [apiNotif, contextHolder] = notification.useNotification();

    useEffect(()=>{
        document.body.setAttribute("theme", selectedTheme === "light" ? "light" : "dark")
    })

    const panels = {
        general: {inst: <GeneralPanel apiNotification={apiNotif} key={'2'}/>, title: "Главная"},
        lang: {inst: <LangPanel apiNotification={apiNotif} key={'2'}/>, title: "Языки"},
        FAQ: {inst: <FAQPanel apiNotification={apiNotif} key={'2'}/>, title: "FAQ"},
    }
    let currentPanel = panels.general;
    if(panels[selectedMenuItem] != null){
        currentPanel = panels[selectedMenuItem];
    }
    const items = [
        getItem('Главная', 'general', <DesktopOutlined />),
        getItem('Статистика', 'statics', <BarChartOutlined />),
        getItem('Языки', 'lang', <CommentOutlined />),
        getItem('Пользователи', 'users', <UserOutlined />),
        getItem('Подразделения', 'divisions', <TeamOutlined />),
        getItem('Задания', 'tasks', <DatabaseOutlined />),
        getItem('FAQ', 'FAQ', <QuestionCircleOutlined />),
        //getItem(<div className={"ticketButton"}><div className={"title"}>Обращения <div style={{background: theme.defaultConfig.token.colorError}} className={"dot"}></div></div> </div>, 'tickets', <ExclamationCircleOutlined />),
        //getItem('О компании', 'company', <FormOutlined />),
        getItem('Светлая тема', 'theme', selectedTheme === "light" ? <BulbFilled style={{color:  "#FFEB3B"}} /> : <BulbOutlined />),
    ];

    const toggleTheme = () => {
        const newTheme = selectedTheme === "light" ? "dark" : "light"
        setSelectedTheme(newTheme);
        document.body.setAttribute("theme", newTheme)
    }

    const onMenuButton = (key) => {
        if(key === 'theme'){
            toggleTheme();
        }
    }

    return(<div className="App">
        <ConfigProvider
            theme={{algorithm: selectedTheme === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm}}>
            {contextHolder}
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
                <Layout.Sider className={"mainMenu"} theme={"light"} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div
                        className={`layout-header${collapsed ? " hidden" : ""}`}
                    >
                        <div className={"icon"}><RobotFilled /></div>
                        <div className={"content"}>Admin Panel</div>
                    </div>
                    <Menu theme="light" selectedKeys={selectedMenuItem} mode="inline" items={items} onSelect={(item) => {
                        onMenuButton(item.key)
                        if(item.key == 'theme'){
                            return;
                        }
                        setSelectedMenuItem(item.key);
                    }} />
                </Layout.Sider>
                <Layout className="site-layout">
                    <Layout.Header
                        className={"mainHeader"}
                    >
                        {currentPanel.title}
                    </Layout.Header>
                    <Layout.Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: theme.defaultConfig.token.colorBgContainer,
                        }}
                        className={"mainContent"}
                    >
                        {currentPanel.inst}
                    </Layout.Content>
                    <Layout.Footer style={{ textAlign: 'center' }}>Команда "Интернет кузница" / "Internet Forge" (Code Rocks 2023)</Layout.Footer>
                </Layout>
            </Layout>

        </ConfigProvider>
    </div>)
}

export default App;
