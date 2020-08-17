// src/App.js

import React from "react";
import NavBar from "./components/NavBar/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { BaseCSS } from 'styled-bootstrap-grid';
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ExternalApi from "./components/ExternalApi";
import Login from "./views/Login/Login";
import Patients from "./views/Patients/Patients.js";
import Patient from "./views/Patients/Patient.js";
import PatientEdit from "views/Patients/PatientEdit/PatientEdit"
import Labs from "views/Labs/Labs.js"
import AdmissionsWard from "views/AdmissionsWard/AdmissionsWard.js"
import TransfersWard from "views/TransfersWard/TransfersWard.js"
import DischargesWard from "views/DischargesWard/DischargesWard.js"
import LabTestView from "views/Labs/LabTestView.js"
import AdminView from 'views/AdminView'
import Calendar from 'views/Calendar/Calendar'
import Moment from 'react-moment'
import 'moment-timezone'


import "./App.css";
import StaffEdit from "views/StaffEdit/StaffEdit";

function NoAccess() {
  return (
    <div style={{position: "fixed", left: '50%', top: '50%', transform: "translate(-50%, -50%)", fontSize: 30}}>
      You have no access
    </div>
  )
}

function App() {
  const { loading, isAuthenticated, hasPermissions } = useAuth0();
  
  if (loading) {
    return (
      <div>Loading...</div>
    );
  }
  
  Moment.globalTimezone = 'America/Toronto';
  
  return (
    <div className="App">
      <BaseCSS/>
      {/* New - use BrowserRouter to provide access to /profile */}
      <BrowserRouter>
        {isAuthenticated && hasPermissions && <NavBar/>}
        <div className="Content">
          <Switch>
              <Route path="/" exact component={Login}/>
              <PrivateRoute exact noaccess path="/noaccess" component={NoAccess} />
              <PrivateRoute path="/calendar" component={Calendar} />
              <PrivateRoute path="/patient" component={Patients} exact/>
              <PrivateRoute path="/patient/edit/:id" component={PatientEdit} exact/>
              <PrivateRoute path="/patient/edit/" component={PatientEdit} exact/>
              <PrivateRoute path="/patient/:id" component={Patient}  />
              <PrivateRoute path="/external-api" component={ExternalApi} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/labs" component={Labs} />
              <PrivateRoute path="/admissions" component={AdmissionsWard} />
              <PrivateRoute path="/transfers" component={TransfersWard} />
              <PrivateRoute path="/discharges" component={DischargesWard} />
              <PrivateRoute exact path={`/labs/:labid/`} component={LabTestView} /> 
              <PrivateRoute exact path={`/admin/registered/:id`} position={"admin"} component={StaffEdit} /> 
              <PrivateRoute exact path={`/admin/staff/:id`} position={"admin"} component={StaffEdit} /> 
              <PrivateRoute path={`/admin`} position={"admin"} component={AdminView} /> 

          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}




export default App;