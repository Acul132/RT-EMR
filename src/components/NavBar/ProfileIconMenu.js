import React, {useState} from 'react';
import styles from './NavBar.module.css'
import {Menu, MenuItem, Divider} from "../Menu"
import { faDoorOpen, faWrench } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from "../../react-auth0-spa";



function ProfileIconMenu(props) {

    const { logout } = useAuth0();
    const child = React.createRef();

    const enter = () => {
        child.current.open();
    }

    const leave = () => {
        child.current.close();
    }

    return (
        <div className={styles.ProfileIcon} onMouseEnter={enter} onMouseLeave={leave}>
            <Menu ref={child}>
                <MenuItem icon={faWrench} text="Settings" onClick={() => {}}></MenuItem>
                <Divider/>
                <MenuItem icon={faDoorOpen} text="Logout" onClick={() => logout()}></MenuItem>
            </Menu>
        </div>
    );
}

export default ProfileIconMenu;