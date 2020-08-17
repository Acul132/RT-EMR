import React, { Component } from 'react';
import Table from 'components/Table/Table';
import styles from './Admissions.module.css'
import withPatientContext from 'withPatientContext';
import {Auth0Context} from "react-auth0-spa"
import Moment from 'react-moment'

class Admissions extends Component {
    constructor(props){
        super(props)

        this.state = {
            rows: []
        }

        this.header = ["nurse", "doctor", "ward", "admission_date"]
    }

    loadAdmissions(){
        this.context.api.admissions(this.props.patientContext.patient.id).then(admissions => {
            admissions = admissions.map(admission => {
                let admissionObject = {
                    nurse: admission.nurse.person.first_name+' '+admission.nurse.person.last_name,
                    ward: admission.ward.department_name+' Floor: '+admission.ward.floor+' Room: '+admission.ward.room,
                    admission_date: <Moment format="YYYY-MM-DD h:mm:ss a">{admission.admission_date}</Moment>
                }
                if(admission.doctor)
                    admissionObject.doctor = admission.doctor.person.first_name+' '+admission.doctor.person.last_name
                return admissionObject
            })
            this.setState({rows: admissions})
        })
    }

    render() {
        if(!this.props.patientContext.loading){
            this.loadAdmissions()
        }
        return (
            <div className={styles.root}>
                <Table rows={this.state.rows}  header={this.header} moduleName="Admissions"></Table>
            </div>
        );
    }
}
Admissions.contextType = Auth0Context
export default withPatientContext(Admissions);