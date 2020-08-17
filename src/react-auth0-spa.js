// src/react-auth0-spa.js
import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import api from "./Api";


const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {

  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [socketClient, setSocket] = useState();
  const [hasPermissions, setHasPermissions] = useState(false)
  const [staff, setStaff] = useState();
  const [_api, setApi] = useState();

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);
      

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);

        setApi(new api(auth0FromHook, await auth0FromHook.getTokenSilently()));

        

        let id = user.sub.split("|")[1];
        console.log(id)
        const token = await auth0FromHook.getTokenSilently(); 

        const result = await fetch(`${(process.env.NODE_ENV === "production") ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL_DEV}/staff/login/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({id: id})
        });
        
        const staff = await result.json()
        setStaff(staff)
        console.log(staff.position instanceof Object && staff.person instanceof Object && staff.person.active)
        if(staff.position instanceof Object && staff.person instanceof Object && staff.person.active) {
          setHasPermissions(true)
        } 
      }

     

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };


  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();

    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return (
    <Auth0Context.Provider
      value={{
        hasPermissions,
        staff,
        api: _api,
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        socketClient,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};