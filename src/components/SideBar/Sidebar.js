import React from 'react';
import styles from "./Sidebar.module.css"

function Sidebar({children}) {
    return (
        <ul className={styles.SidebarContainer}>
            {children}
        </ul>
    );
}

export default Sidebar;