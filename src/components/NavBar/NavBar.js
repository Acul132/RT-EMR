// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import AppIconComponent from "./AppIconComponent";
import NavBarLink from "./NavBarLink";
import { faUser, faCalendar, faFlask, faWrench, faDoorOpen, faDoorClosed, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import ProfileIconMenu from "./ProfileIconMenu"


const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div className={styles.NavBarContainer}>
      <AppIconComponent/>
      <div className={styles.NavBarLinkContainer}>
        <NavBarLink path="/patient" icon={faUser} tooltip={"Patients"}/>
        <NavBarLink path="/calendar" icon={faCalendar} tooltip={"Calendar"}/>
        <NavBarLink path="/labs" icon={faFlask} tooltip={"Lab reports"}/>
        <NavBarLink path="/admin" icon={faWrench} tooltip={"Admin Panel"} position="admin"/>

      </div>
      <ProfileIconMenu/>
    </div>
  );
};

export default NavBar;