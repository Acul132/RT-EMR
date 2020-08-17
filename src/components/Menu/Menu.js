import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import styles from "./Menu.module.css"

class Menu extends Component {

    constructor() {
        super();
        this.state = {parentBound: null, position: null, open: false}
    }

    componentDidMount() {
        this.setState({parentBound: ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect()})
        console.log(ReactDOM.findDOMNode(this).getBoundingClientRect())
    }

    componentDidUpdate() {
        if(this.state.parentBound != null && this.state.position == null) {
            let me = ReactDOM.findDOMNode(this);
            let left = this.state.parentBound.left + this.state.parentBound.width/2 + "px";
            let top = this.state.parentBound.top + this.state.parentBound.height/2 - me.clientHeight + "px";
            this.setState({position: {position: "fixed", left: left, top: top}})
        }
    }

    open() {
        this.setState({open: true})
    }

    close() {
        this.setState({open: false})

    }

    render() {
        return (
            <div className={styles.MenuContainer} style={{...this.state.position, transform: (this.state.open) ? "scale(1)" : "scale(0)", opacity: (this.state.open) ? "1" : "0"}} >
                <ul className={styles.MenuList}>
                    {this.props.children}
                </ul>
            </div>
        );
    }
}

export default Menu;