import React, { Component } from 'react';
import styles from './Modal.module.css'

class Modal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false
        }
    }

    show() {
        this.setState({open: true})
    }

    close() {
        this.setState({open: false})
    }

    toggle() {
        this.setState({open: !this.state.open})
    }

    close() {
        this.setState({open: false})
    }

    render() {
        return (
            <div className={styles.container} style={this.state.open ? {display: ""} : {display: "none"}} onClick={() => {
                this.setState({open: false})
            }}>
                <div className={styles.modal} onClick={(e) => {e.stopPropagation()}}>
                    {this.props.title && <div className={styles.title}>{this.props.title}</div>}
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Modal;