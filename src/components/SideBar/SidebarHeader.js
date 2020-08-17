import React from 'react';
import styles from "./Sidebar.module.css"


function SidebarHeader({text, style}) {
    return (
        <li className={styles.SidebarHeader}>
            <div  style={style}>
                {text}
            </div>
        </li>
    );
}

export default SidebarHeader;