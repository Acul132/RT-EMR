import React, {useState, useEffect} from 'react';
import Card from 'components/Card/Card';
import styles from "./SummaryCard.module.css"
import {useAuth0} from "react-auth0-spa";
import {usePatient} from 'PatientContext';
import Moment from 'react-moment';

function SummaryCard(props) {
    const {api} = useAuth0();
    let {patient, loading} = usePatient();


    if(loading) {
        return (
            <Card>

            </Card>
        )
    } 
    
    return (
        <Card>
            <div className={styles.container}>
                <div className={styles.picture} style={{background: `url("${patient.person.picture ? patient.person.picture : "https://upload.wikimedia.org/wikipedia/commons/0/0e/Lakeyboy_Silhouette.PNG"}")`}}></div>
                <div className={styles.textBox}>
                    <div className={styles.name}>{patient.person.first_name} {patient.person.last_name}</div>
                    <div className={styles.gender}>{patient.person.sex}</div>
                    <div className={styles.dob}><span>DOB</span> <Moment format={"YYYY-MM-D"}>{patient.person.dob}</Moment></div>
                    <div className={styles.address}>{patient.person.location.address},&nbsp;
                         {patient.person.location.city} {patient.person.location.province},&nbsp;
                        {patient.person.location.country} {patient.person.location.postal_code}
                    </div>
                    <div className={styles.hsn}><span>OHIN</span> {patient.health_card_number}</div>
                </div>
            </div>
        </Card>
    );
}

export default SummaryCard;