/**
 *
 * This file was generated with Adobe XD React Exporter
 * Exporter for Adobe XD is written by: Johannes Pichler <j.pichler@webpixels.at>
 *
 **/

import React from "react";
import styles from "./NavBar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHospital } from '@fortawesome/free-regular-svg-icons'
import { Link } from "react-router-dom"

const AppIconComponent = () => (
  <div style={{width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center"}}>
    <Link to="/patient" className={styles.AppIconBackground}>
      <FontAwesomeIcon icon={faHospital} style={{fontSize: "28px"}} color="white"/>
    </Link>
  </div>
);

export default AppIconComponent;
