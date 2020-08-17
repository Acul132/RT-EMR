import React, { Component } from 'react';

class TabView extends Component {

    constructor() {
        super()
        this.state = {currentView: null}
    }

    componentDidMount() {
        this.setState({currentView: this.props.currentView});
    }

    componentDidUpdate(prevProps) {
        if(prevProps.currentView !== this.props.currentView) {
            this.setState({currentView: this.props.currentView});
        }
    }

    render() {
        return (
            <div style={{display: this.state.currentView === this.props.view ? "" : "none", height: "100%"}}>
                {this.props.children}
            </div>
        );
    }
}

export default TabView;