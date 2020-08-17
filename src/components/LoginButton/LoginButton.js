import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import styles from "./LoginButton.module.css";

const buttonStyle = {
    marginTop: "50px",
    width: "320px",
    height: "104.58px",
    borderRadius: "58.5px",
    background: "linear-gradient(#2bcded 0%, #2b50ed 100%)",
    boxShadow: "0px 8px 30px rgba(43, 184, 237, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

const buttonText = {
    color: "white",
    fontWeight: 600,
    fontSize: "40px",
}
const LoginButton = () => {

    const {loginWithRedirect} = useAuth0();

    return (
        <div className={styles.button} onClick={() =>
            loginWithRedirect({})
          }>
            <div className={styles.text} >Login</div>
        </div>
    )
}

export default LoginButton;

