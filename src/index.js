// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import WebFont from 'webfontloader';
import { GridThemeProvider } from 'styled-bootstrap-grid';
import MetaTags from 'react-meta-tags';
import Favicon from 'react-favicon';
import icon from './logo.svg';


WebFont.load({
  google: {
    families: ['Fira Sans:100,200,300,400,500,600,700', 'sans-serif']
  }
});

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl  
      : window.location.pathname
  );
};

const gridTheme = {
  breakpoints: { // defaults below
    xl: 1350,
    lg: 1000,
    md: 848,
    sm: 576,
    xs: 575,
    // or you can use aliases
    // giant: 1200,
    // desktop: 992,
    // tablet: 768,
    // phone: 576,
    // smaller: 575,
  },
  row: {
    padding: 10, // default 15
  },
  col: {
    padding: 10, // default 15
  },
  container: {
    padding: 0, // default 15
    maxWidth: { // defaults below
      xl: 1206,
      lg: 1000,
      md: 720,
      sm: 540,
      xs: 540,
      // or you can use aliases
      // giant: 1140,
      // desktop: 960,
      // tablet: 720,
      // phone: 540,
      // smaller: 540,
    },
  },
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    audience={config.audience}
    onRedirectCallback={onRedirectCallback}
  >
    <GridThemeProvider gridTheme={gridTheme}>
      <MetaTags>
        <title>RT-EMR</title>
        <meta name="theme-color" content="#db5945"></meta>
      </MetaTags>
      <Favicon url={icon}/>
      <App />
    </GridThemeProvider>
  </Auth0Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();