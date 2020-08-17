import React from 'react';
import styles from "./Sidebar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {Link} from "react-router-dom"


function SidebarLink({icon, text, path}) {
    return (
        <li className={styles.SidebarLink}>
            <Link to={path}>
                <FontAwesomeIcon icon={icon} />
                <span>{text}</span>
            </Link>
        </li>
    );
}

export default SidebarLink;