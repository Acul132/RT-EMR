import React, { Fragment } from "react";
import hero from "../../assets/hero-physicians.svg"
import leftSvgWave from "../../assets/leftSvgWave.svg";
import rightSvgWave from "../../assets/rightSvgWave.svg";
import sunSvg from "../../assets/sunSvg.svg";
import appIconSvg from "../../assets/App Icon.svg"
import SVG from "react-inlinesvg"
import { useAuth0 } from "../../react-auth0-spa";
import AppIconComponent from "../../components/AppIconComponent"
import LoginButton from "../../components/LoginButton/LoginButton"
import styles from "./Login.module.css";
import { useHistory } from "react-router-dom";





function Login() {
  const {loading, isAuthenticated} = useAuth0();
  let history = useHistory();

  if(isAuthenticated) {
    history.push('/patient')
  }

  return (
    <div style={{height: "722px"}}>
      <div className={styles.leftWaveSvgDiv}>
        <SVG src={leftSvgWave} width="100%" height="100%"/>
      </div>
      <div className={styles.rightWaveSvgDiv}>
        <SVG src={rightSvgWave} width="100%" height="100%"/>
      </div>
      <div className={styles.sunSvgDiv}>
        <SVG src={sunSvg} width="457" height="457"/>
      </div>
      <div className={styles.heroSvg}>
        <SVG src={hero} width="100%" height="100%"/>
      </div>
      <div className={styles.appIconSvgDiv}> 
        <AppIconComponent/>
        <div style={{fontSize: "70px", fontWeight: 600}}>RT-EMR</div>
        <LoginButton/>
      </div>
    </div>
  );
}

export default Login;