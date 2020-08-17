// src/components/PrivateRoute.js

import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";
import { useHistory } from 'react-router-dom'

const PrivateRoute = ({ noaccess, component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect, hasPermissions, staff } = useAuth0();
  const [hasPosition, setHasPosition] = useState()
  const history = useHistory();
  const [check, setCheck] = useState(false);

  useEffect(() => {
    console.log("load")

    if(loading) return

    if(noaccess) {
      setCheck(true);
    }
    
    if(!hasPermissions) {
      history.push("/noaccess")
      return;
    }
    if (isAuthenticated || hasPermissions) {
    
      if(rest.position && staff.position.position_name !== rest.position) {
        history.goBack();
        setHasPosition(false)
      } else {
        setHasPosition(true)
      }
      if(hasPosition && hasPermissions) {
        console.log("check", true)
        setCheck(true);
      }
      return;
    }
    
    console.log("redirect")
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path }
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path, hasPermissions, hasPosition, check]);

  const render = props => isAuthenticated === true && check ? <Component {...props} /> : null;
  
  
  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;