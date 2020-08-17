import React, { Component } from 'react';
import styles from './Tabs.module.css'
import HeaderTabs from 'components/HeaderTabs/HeaderTabs';
import HeaderTab from 'components/HeaderTabs/HeaderTab';
import TabView from './TabView';

class Tabs extends Component {
    constructor() {
        super()
        this.state = {currentView: null, headers: null}
    }
    
    componentDidMount() {
       this.setState({currentView: this.props.default})
    }

    selectTab(tab) {
        this.setState({currentView: tab})

    }
    

    render() {
        const childrenWithProp = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {currentView: this.state.currentView, open: () => {this.selectTab(child.props.view)}})
        })        
        return (
            <div className={`${this.props.rounded ? styles.rounded : ""}`}>
                <HeaderTabs>
                    {Object.keys(this.props.tabs).map((key) => {
                        return <HeaderTab key={key} text={this.props.tabs[key]} selected={this.state.currentView === key} onClick={() => {this.selectTab(key)}}/>
                    })}
                </HeaderTabs>
                <div className={styles.Tabs}>
                    {childrenWithProp}
                </div>
            </div>
        );
    }
}

export default Tabs;