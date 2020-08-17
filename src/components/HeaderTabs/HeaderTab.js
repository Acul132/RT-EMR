import React, {useEffect, useState} from 'react';
import styles from './HeaderTabs.module.css'

function HeaderTab({text, onClick, selected}) {

    const [isSelected, setSelected] = useState(false)  

    useEffect(() => {
        setSelected(selected);
    }, [selected])
    
    const handleClick = () => {
        if(onClick) onClick();
    }


    return (
        <div className={`${styles.HeaderTab} ${isSelected ? styles.selected : ""}`} onClick={() => {handleClick()}}>
            <div>{text}</div>
        </div>
    );
}

export default HeaderTab;