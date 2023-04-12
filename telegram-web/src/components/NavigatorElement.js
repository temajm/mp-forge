import React from "react"

export default class NavigatorElement extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return this.props.children;
    }
}