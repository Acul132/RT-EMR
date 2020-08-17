import React, { Component } from 'react';
import styles from './ToolTip.module.css'
import ReactDOM from 'react-dom'

class ToolTip extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showRight: true
        }
    }

    componentDidMount() {
        this.node = ReactDOM.findDOMNode(this)
        this.parent = this.node.parentNode
        this.parentBound = this.parent.getBoundingClientRect()
        if(this.parentBound.x + this.node.clientWidth + this.parent.clientWidth > window.innerWidth) {
            this.setState({showRight: false})
        }

        this._mouseEnter = this.parent.addEventListener("mouseenter", () => {this.mouseEnter()})
        this._mouseLeave = this.parent.addEventListener("mouseleave", () => {this.mouseLeave()})

    }

    componentWillUnmount() {
        this.parent.removeEventListener("mouseenter", this._mouseEnter)
        this.parent.removeEventListener("mouseleave", this._mouseLeave)
    }
    

    mouseEnter() {
        this.setState({hovering: true})
    }

    mouseLeave() {
        this.setState({hovering: false})
    }

    render() {
        return (
            <div className={`${styles.ToolTip} ${this.state.showRight ? styles.right : styles.left} ${this.state.hovering ? styles.hovering : ""}`}>
                {this.props.text}
            </div>
        );
    }
}

export default ToolTip;