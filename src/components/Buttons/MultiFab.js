import React, {useState} from 'react';
import styles from './Button.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
function MultiFab({icon, children}) {
    const [showing, setShowing] = useState(false);
    return (
        <div className={styles.MultiFab} onClick={() => {setShowing(!showing)}}>
            <FontAwesomeIcon icon={showing ? faTimes : icon}/>
            <div className={styles.innerFab}>
                {React.Children.map(children, (child, index) => {
                    return React.cloneElement(child, showing ? {className: styles.showing, style: {transform: `translateY(${(index + 1) * 60 * -1}px)`, opacity: 1, pointerEvents: "all"}} : {style: {transform: `translateY(0px)`, opacity: 0, pointerEvents: "none"}})
                })}
            </div>
        </div>
    );
}

export default MultiFab;