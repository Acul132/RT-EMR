// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { Link, useHistory } from "react-router-dom";
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ToolTip from "components/ToolTip/ToolTip";

const NavBarLink = ({path, icon, tooltip, position = null}) => {
  let history = useHistory()


  
  const { isAuthenticated, loginWithRedirect, logout, staff } = useAuth0();
  if(position) {
    if(staff && position !== staff.position.position_name) {
      return null
    }
  }

  return (
    <Link  to={path} className={styles.NavLinkContainer}>
      <div  className={`${styles.NavLinkBackground} ${(path == history.location.pathname) ? styles.active : ""}`}></div>
      <FontAwesomeIcon icon={icon}  color="white" style={{fontSize: "20px"}}/>
      {tooltip && <ToolTip text={tooltip}/>}
    </Link>
  );
};

export default NavBarLink;