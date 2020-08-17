import React from 'react';
import styles from './Button.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Button({secondary, text, icon, onClick}) {
    return (

        <button className={`${styles.button} ${(secondary) ? styles.secondaryButton : styles.primaryButton }`} onClick={onClick ? () => {onClick()} : () => {}}>
            {icon && <div><FontAwesomeIcon icon={icon}/></div>}
            {text}    
        </button>
    );
}

export default Button;