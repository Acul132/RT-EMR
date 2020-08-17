import React from 'react';
import styles from "./Card.module.css"
import Patient from 'views/Patients/Patient';
import Button from "components/Buttons/Button";
import {faSearch} from "@fortawesome/free-solid-svg-icons"

function Card({children}) {

    return (
        <div className={styles.card}>
            {children}
        </div>
    );
}

export default Card;