import React, { Component } from 'react';
import Table from 'components/Table/Table';
import styles from './Discharges.module.css'
import withPatientContext from 'withPatientContext';
import {Auth0Context} from "react-auth0-spa"
import Moment from 'react-moment'

class Discharges extends Component {
    constructor(props){
        super(props)

        this.state = {
            rows: []
        }

        this.header = ["nurse", "doctor", "ward", "discharge_date"]
    }

    loadDischarges(){
        this.context.api.discharges(this.props.patientContext.patient.id).then(discharges => {
            discharges = discharges.map(discharge => {
                let dischargeObject = {
                    nurse: discharge.nurse.person.first_name+' '+discharge.nurse.person.last_name,
                    ward: discharge.ward.department_name+' Floor: '+discharge.ward.floor+' Room: '+discharge.ward.room,
                    discharge_date: <Moment format="YYYY-MM-DD h:mm:ss a">{discharge.discharge_date}</Moment>
                }
                if(discharge.doctor)
                    dischargeObject.doctor = discharge.doctor.person.first_name+' '+discharge.doctor.person.last_name
                return dischargeObject
            })
            this.setState({rows: discharges})
        })
    }

    render() {
        if(!this.props.patientContext.loading){
            this.loadDischarges()
        }
        return (
            <div className={styles.root}>
                <Table rows={this.state.rows}  header={this.header} moduleName="Discharges"></Table>
            </div>
        );
    }
}
Discharges.contextType = Auth0Context
export default withPatientContext(Discharges);