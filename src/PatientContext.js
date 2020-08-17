import React, { Component, useContext } from 'react';
import { useAuth0, Auth0Context } from "react-auth0-spa";


export const PatientContext = React.createContext();
export const usePatient = () => useContext(PatientContext);


export class PatientProvider extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            patient: null
        }
    }

    componentDidMount() {
        this.context.api.patient(this.props.id).then((patient) => {
            this.setState({patient, loading: false});
        })

        this.context.api.patientService().subscribe((p) => {
            if(this.state.patient.id === p.id) {
                this.setState({patient: p});
                console.log("new patient")
            }
        })
    }

    render() {
        return (
            <PatientContext.Provider
                value={{
                    loading: this.state.loading,
                    patient: this.state.patient
                }}
            >
                {this.props.children}
            </PatientContext.Provider>
        );
    }
}
PatientProvider.contextType = Auth0Context
