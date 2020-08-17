import React from 'react';
import styles from "./Menu.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function MenuItem(props) {
    return (
        <li className={styles.MenuItem} onClick={() => props.onClick()}>
            <div>
                <FontAwesomeIcon icon={props.icon} />
                <span>{props.text}</span>
            </div>
        </li>
    );
}

export default MenuItem;