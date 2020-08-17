import React, { Component } from 'react';
import Table from 'components/Table/Table';
import styles from './Transfers.module.css'
import withPatientContext from 'withPatientContext';
import {Auth0Context} from "react-auth0-spa"
import Moment from 'react-moment'

class Transfers extends Component {
    constructor(props){
        super(props)

        this.state = {
            rows: []
        }

        this.header = ["nurse", "doctor", "from_ward", "to_ward", "transfer_date"]
    }

    loadTransfers(){
        this.context.api.transfers(this.props.patientContext.patient.id).then(transfers => {
            transfers = transfers.map(transfer => {
                let transferObject = {
                    nurse: transfer.nurse.person.first_name+' '+transfer.nurse.person.last_name,
                    from_ward: transfer.from_ward.department_name+' Floor: '+transfer.from_ward.floor+' Room: '+transfer.from_ward.room,
                    to_ward: transfer.to_ward.department_name+' Floor: '+transfer.to_ward.floor+' Room: '+transfer.to_ward.room,
                    transfer_date: <Moment format="YYYY-MM-DD h:mm:ss a">{transfer.transfer_date}</Moment>
                }
                if(transfer.doctor)
                    transferObject.doctor = transfer.doctor.person.first_name+' '+transfer.doctor.person.last_name
                return transferObject
            })
            this.setState({rows: transfers})
            console.log(transfers)
        })
    }

    render() {
        if(!this.props.patientContext.loading){
            this.loadTransfers()
        }
        return (
            <div className={styles.root}>
                <Table rows={this.state.rows}  header={this.header} moduleName="Transfers"></Table>
            </div>
        );
    }
}
Transfers.contextType = Auth0Context
export default withPatientContext(Transfers);