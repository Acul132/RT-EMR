import React from 'react';
import styles from './Pill.module.css'
function Pill({color, text}) {
    return (
        <div style={{display: "flex"}}>
            <div className={styles.container} style={{background: `${color}26`}}>
                <div style={{color}}>{text}</div>
            </div>
        </div>
    );
}

export default Pill;