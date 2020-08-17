import React from 'react';
import styles from './Button.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToolTip from 'components/ToolTip/ToolTip';

function Fab(props) {
    return (
        <div style={props.style} className={styles.Fab} onClick={() => {props.onClick()}}>
            <FontAwesomeIcon icon={props.icon}/>
            {props.tooltip && <ToolTip text={props.tooltip}/>}
        </div>
    );
}

export default Fab;