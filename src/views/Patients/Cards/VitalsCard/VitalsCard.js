import React from 'react';
import styles from "./VitalsCard.module.css";
import textStyles from "components/TextStyles.module.css";
import Card from "components/Card/Card"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';


function VitalsCard(props) {
    const bpm = 72;

    const animTime = 60 / bpm;

    return (
        <Card>
            <div className={styles.container}>
                <FontAwesomeIcon icon={faHeartbeat} className={styles.vitalIcon} style={{animationDuration: `${animTime}s`}}/>
                <div className={textStyles.header4} style={{marginTop: "10px"}}>Vitals</div>
                <div className={styles.vitals}>
                    <div>
                        <div>120</div>
                        <div>80</div>
                    </div>
                    <div>
                        <div>72</div>
                        <div>bpm</div>
                    </div>
                </div>
                <div className={styles.date}>01/11/18 - 10:30 am</div>
            </div>
        </Card>
    );
}

export default VitalsCard;