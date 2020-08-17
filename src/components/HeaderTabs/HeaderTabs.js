import React, { Component } from 'react';
import styles from './HeaderTabs.module.css'

class HeaderTabs extends Component {
    render() {
        return (
            <div className={styles.headerTabs}>
                 {this.props.children}
            </div>
        );
    }
}

export default HeaderTabs;