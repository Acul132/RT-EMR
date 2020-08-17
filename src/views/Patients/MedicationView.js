import React, { Component } from 'react';
import {Auth0Context} from "react-auth0-spa"
import PageHeader from 'components/PageHeader/PageHeader';
import Button from 'components/Buttons/Button';
import Tabs from 'components/Tabs/Tabs'
import TabView from 'components/Tabs/TabView';
import Table from 'components/Table/Table'
import Moment from 'react-moment'
import styles from './MedicationView.module.css'
import withPatientContext from 'withPatientContext';

class MedicationView extends Component {
    constructor(props){
        super(props)

        this.state = {
            rows : [],
            medicationInfo : {},
            hasActive: false
        }

        this.headers = ['start_date', 'end_date', 'prescribed_by', 'daily_quantity', 'sig']
    }

    componentDidMount(){
        this.loadPrescriptionHistory()
        this.loadMedicationInfo()
        if(Object.entries(this.activePrescription()).length !== 0)
            this.setState({hasActive: true})
    }

    componentDidUpdate(){
        if(!this.state.hasActive && Object.entries(this.activePrescription()).length !== 0)
            this.setState({hasActive: true})
    }

    loadPrescriptionHistory(){
        this.context.api.prescriptionHistory(this.props.match.params.id, this.props.match.params.medicationId).then(prescriptions => {
            prescriptions = prescriptions.map(prescription => {
                let prescriptionObject = {
                    start_date: <Moment format="YYYY-MM-DD h:mm a">{prescription.administered_date}</Moment>,
                    end_date: (prescription.end_date) ? <Moment format="YYYY-MM-DD h:mm a"></Moment> : '',
                    prescribed_by: prescription.doctor.person.first_name+' '+prescription.doctor.person.last_name,
                    sig: prescription.sig,
                    daily_quantity: prescription.daily_quantity,
                    prescription_object: prescription
                }
                return prescriptionObject
            })
            this.setState({rows: prescriptions})  
        })
    }

    loadMedicationInfo(){
        this.context.api.medicationInfo(this.props.match.params.medicationId).then(medication => this.setState({medicationInfo: medication}))
    }

    activePrescription(){
        let activePrescription = {}
        this.state.rows.forEach(prescription => {
            if(prescription.end_date === '')
                activePrescription = prescription.prescription_object
        })
        return activePrescription
    }

    inactivatePrescription(){
        let prescription = this.activePrescription()
        prescription.active = false
        prescription.end_date = new Date().toISOString()

        this.context.api.updatePrescription(prescription).then(result => {
            this.loadPrescriptionHistory()
            this.setState({hasActive: false})
        })
    }

    render() {
        const {name, strength, unit_of_measure} = this.state.medicationInfo
        return (
            <div>
                <PageHeader title={name + ' ' + strength + unit_of_measure} tabbed back="Medications">
                    {this.state.hasActive && <Button text="Inactive" onClick={() => {this.inactivatePrescription()}}/>}
                </PageHeader>
                <Tabs tabs={{history: "History"}} default={"history"}>
                    <TabView view={"history"}>
                        <Table height="400px" rows={this.state.rows} header={this.headers} tabbed moduleName="History" />
                    </TabView>
                </Tabs>
            </div>
        );
    }
}

MedicationView.contextType = Auth0Context
export default withPatientContext(MedicationView);