import React from 'react';
import styles from "./VisitCard.module.css";
import textStyles from "components/TextStyles.module.css";
import Card from "components/Card/Card"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { usePatient } from 'PatientContext';
import Button from 'components/Buttons/Button'

function VisitCard(props) {
    const {patient, loading} = usePatient();
    return (
        <Card>
            <div className={styles.container}>
                <FontAwesomeIcon icon={faBed} className={styles.bedIcon}/>
                <div className={textStyles.header4} style={{marginTop: "10px"}}>Visit</div>
                
                    
                    {!loading && patient.ward && 
                        <div className={styles.visitText}>
                            <div>
                                <div>Room</div>
                                <div>Ward</div>
                                <div>Nurse</div>
                            </div>
                            <div>
                                <div>{patient.ward.room}</div>
                                <div style={{fontSize: 12, lineHeight: "30px"}}>{patient.ward.department_name}</div>
                                <div style={{fontSize: 12, lineHeight: "30px"}}>{patient.nurse.person.first_name} {patient.nurse.person.last_name}</div>
                            </div>
                        </div>
                    }
                    {!loading && !patient.ward &&
                        <div style={{marginTop: 60}}>
                            Patient not admitted
                        </div>
                    }
                    
                
            </div>
        </Card>
    );
}

export default VisitCard;