import React from "react"
import NavigatorElement from "./NavigatorElement";

export default class NavigatorComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props)
        if(this.props?.children == null){
            return null;
        }
        const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if(!child instanceof NavigatorElement){
                continue;
            }

            if(child?.props?.panel === this.props?.activePanel) {
                return child;
            }
        }
        return null;
    }
}