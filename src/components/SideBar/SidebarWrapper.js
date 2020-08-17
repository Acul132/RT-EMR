import React from 'react';
import styles from "./Sidebar.module.css"

function SidebarWrapper({children}) {
    return (
        <div className={styles.SidebarWrapper}>
            {children}
        </div>
    );
}

export default SidebarWrapper;