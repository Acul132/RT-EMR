import React, { Component } from 'react';
import styles from './Checkbox.module.css'
import ReactDOM from 'react-dom';

class Checkbox extends Component {

    constructor() {
        super()
        this.state = {
            visible: true
        }
    }

    componentDidMount() {
        this.setState({input: ReactDOM.findDOMNode(this).querySelector('input')})
        if(this.props.table) {
            this.setState({visible: false})
        }
    }

    toggle() {
        this.setState({visible: !this.state.visible})
    }

    click() {
        this.state.input.click();
    }

    render() {
        return (
            <input type="checkbox" style={this.props.style} className={`${styles.input} ${this.props.table ? styles.table : ""} ${this.state.visible ? styles.visible : ""}`} name={this.props.name} value={this.props.value}/>
        );
    }
}

export default Checkbox;