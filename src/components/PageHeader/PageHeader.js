import React from 'react';
import styles from "./PageHeader.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from "react-router-dom";


function PageHeader({children, title, tabbed, back}) {
    let history = useHistory()
    return (
        <div className={`${styles.PageHeader} ${tabbed ? styles.Tabbed : ""} ${back ? styles.isBack : ""}`}>
            {back && <div className={styles.back} onClick={() => {history.goBack()}}>
                <FontAwesomeIcon icon={faChevronLeft} className={styles.icon}/>
                {back}    
                <span>-</span>
            </div>}
            <div className={styles.Title}>
                {title}
            </div>
            <div className={styles.Actions}>
                {children}
            </div>
        </div>
    );
}

export default PageHeader;