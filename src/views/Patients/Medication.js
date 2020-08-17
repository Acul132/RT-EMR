import React, { Component } from 'react';
import Table from 'components/Table/Table'
import styles from './Medications.module.css'
import Button from 'components/Buttons/Button'
import {faSearch, faPlus} from '@fortawesome/free-solid-svg-icons'
import {Auth0Context} from "react-auth0-spa"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import AddMedication from './AddMedication';
import Modal from 'components/Modal/Modal';
import withPatientContext from 'withPatientContext';
import Moment from 'react-moment'

class Medication extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showModal: false,
            rows: []
        }
        this.modal = React.createRef()

        this.header = ["drug_name", "sig", "daily_quantity", "prescribed_by", "administered_date", "active"]
        this.additionalFields = [
            <div className={styles.searchInputBox}><FontAwesomeIcon className={styles.searchIcon} icon={faSearch}/>
            <input className={styles.searchInput} placeholder={`Search Medications`}></input></div>,
            <Button icon={faPlus} text={"Add Medication"} onClick={() => {this.modal.current.show()}}/>
        ]
    }

    componentDidMount(){
        if(!this.props.patientContext.loading){
            this.loadPrescriptions()
        }
    }

    loadPrescriptions(){
        this.context.api.prescriptions(this.props.patientContext.patient.id).then(prescriptions => {
            const activePrescriptions = prescriptions.filter(prescription => prescription.active).map(prescription => {
                let prescriptionObject = {
                    id: prescription.medication_id,
                    drug_name: prescription.name + ' ' + prescription.strength + prescription.unit_of_measure,
                    sig: prescription.sig,
                    daily_quantity: prescription.daily_quantity,
                    prescribed_by: prescription.first_name+' '+prescription.last_name,
                    administered_date: <Moment format="YYYY-MM-DD h:mm:ss a">{prescription.administered_date}</Moment>,
                    active: "true"
                }
                return prescriptionObject
            })

            const inactivePrescriptions = prescriptions.filter(prescription => !prescription.active).map(prescription => {
                let prescriptionObject = {
                    id: prescription.medication_id,
                    drug_name: prescription.name + ' ' + prescription.strength + prescription.unit_of_measure,
                    sig: prescription.sig,
                    daily_quantity: prescription.daily_quantity,
                    prescribed_by: prescription.first_name+' '+prescription.last_name,
                    administered_date: <Moment format="YYYY-MM-DD h:mm:ss a">{prescription.administered_date}</Moment>,
                    active: "false"
                }
                return prescriptionObject
            })
            let allPrescriptions = [...activePrescriptions, ...inactivePrescriptions]
            this.setState({rows: allPrescriptions})   
        })
    }

    addMedication(body){
        body.patient_id = this.props.patientContext.patient.id
        this.context.api.newPrescription(body).then(() => this.modal.current.close())
    }

    render() {
        return (
            <div className={styles.root}>
                <Table rows={this.state.rows} header={this.header} moduleName="Medications" viewable additionalFields={this.additionalFields}/>
                <Modal ref={this.modal}>
                    <AddMedication handleAddMedication={this.addMedication.bind(this)} rows={[]}/>
                </Modal>
            </div>
        );
    }
    
}
Medication.contextType = Auth0Context
export default withPatientContext(Medication);

