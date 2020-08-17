import React from 'react';
import styles from "./Patients.module.css"
import { Link } from "react-router-dom"
import moment from 'moment'


function PatientHit({patient, index}) {
    if("person" in patient) {
        patient.sex = patient.person.sex;
        patient.picture = patient.person.picture;
        patient.first_name = patient.person.first_name;
        patient.last_name = patient.person.last_name;
        patient.dob = patient.person.dob;
        patient.address = patient.person.location.address
    }
    return (
        <Link to={`/patient/${patient.id}/summary`} className={styles.patientHitContainer} style={{animationDelay: `${index * 60 + 300}ms`}}>
            <div className={styles.hitAvatar} style={{background: `url('${patient.picture ? patient.picture : "https://upload.wikimedia.org/wikipedia/commons/0/0e/Lakeyboy_Silhouette.PNG"}')`, backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <div className={styles.hitText}>
                <div>{patient.first_name}</div>
                <div>{patient.last_name}</div>
                <div className={styles.hitAgeGender}>
                    <div className={styles.hitAge}>
                        <div>Age</div>
                        <div>{moment().diff(new Date(patient.dob), 'years')}</div>
                    </div>
                    <div className={styles.hitGender}>
                        <div>Gender</div>
                        <div>{patient.sex}</div>
                    </div>
                </div>
                <div><div style={{margin: "0 10px"}}>{patient.address}</div></div>
            </div>
        </Link>
    );
}

export default PatientHit;