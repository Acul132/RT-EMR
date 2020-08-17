// src/views/ExternalApi.js

import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";


const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [timestamp, setTimestamp] = useState("Waiting timestamp");
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently, socketClient } = useAuth0();
  

  const callApi = async () => {
    try {
      const token = await getTokenSilently();

      const response = await fetch("/api/external", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const callSocket = async () => {
    
    socketClient.on('timer', timestamp => setTimestamp(timestamp));
    socketClient.emit('subscribeToTimer', 1000);
  }

  return (
    <>
      <h1>External API</h1>
      <button onClick={callApi}>Ping API</button>
      <button onClick={callSocket}>Ping Socket</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
      <code>{timestamp}</code>
    </>
  );
};

export default ExternalApi;