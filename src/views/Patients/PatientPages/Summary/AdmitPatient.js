import React, { Component } from 'react';
import styles from './AdmitPatient.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCalendarDay, faEdit, faSearch} from "@fortawesome/free-solid-svg-icons"
import Dropdown from 'components/Dropdowns/Dropdown'
import Table from 'components/Table/Table'
import {Auth0Context} from "react-auth0-spa"
import Input from 'components/Input/Input';
import Form from 'components/Form/Form'
import Button from 'components/Buttons/Button'
import withPatientContext from 'withPatientContext';

const rows = [
    {drug_name: 'Rabeprazole', dose: '20mg', manufacturer: "apo", strength: "1", quantity: '100', prescribed_by: 'Albert Lee'},
    {drug_name: 'Omeprazole', dose: '40mg', manufacturer: "brand", strength: "0.5", quantity: '20', prescribed_by: 'Albert Lee'},
    {drug_name: 'Temazepam', dose: '20mg', manufacturer: "name", strength: "50", quantity: '300', prescribed_by: 'Albert Lee'},
    {drug_name: 'Hydrochlorothiazied', dose: '25mg', manufacturer: "is",strength: "100", quantity: '50', prescribed_by: 'Stephane Courtemanche'},
    {drug_name: 'Metoprolol', dose: '50mg', manufacturer: "good", strength: "35", quantity: '60', prescribed_by: 'Stephane Courtemanche'},
]

class AdmitPatient extends Component {
    constructor(props){
        super(props)

        this.state = {
            medicationRows : [],
            medicationFilter: '',
            selectedManufacturer: '',
            selectedStrength: '',
            selectedDoctor: '',
            selectedWard: '',
            manufacturers : [],
            strengths: [],
            doctors: []
        }

        this.header = ["department_name", "floor", "room"]
        this.form = React.createRef()
    }

    componentDidMount(){
        this.updateManufacturers()
        this.updateStrengths()
    }

    handleMedicationFilter(event) {
        this.setState({medicationFilter:event.target.value})
        this.context.api.searchWard(event.target.value).then(wards => {
            wards = wards.map(ward => {
                let wardObject = {
                    department_name: ward.department_name,
                    floor: ward.floor,
                    room: ward.room,
                    id: ward.id
                }
                return wardObject
            })
            this.setState({medicationRows:wards})
        })
    }

    filterRows(filter, field='drug_name', filterType='includes'){
        if(field === 'drug_name'){
            if(filter === "")
                this.setState({medicationRows: rows})
            else
                this.setState({medicationRows: rows.filter(row => row.drug_name.toUpperCase().includes(filter.toUpperCase()))})
        }
        else{
            if(filterType === 'includes')
                this.setState(prevState => ({medicationRows: prevState.medicationRows.filter(row => row[field].toUpperCase().includes(filter.toUpperCase()))}))
            else if(filterType ==='equals')
                this.setState(prevState => ({medicationRows: prevState.medicationRows.filter(row => row[field].toUpperCase() === filter.toUpperCase())}))
        }
        this.updateManufacturers()
        this.updateStrengths()
    }

    updateManufacturers(){
        let manufacturers = []
        this.state.medicationRows.map(medicationRow => {
            if(!manufacturers.includes(medicationRow.manufacturer))
                manufacturers.push(medicationRow.manufacturer)
        })
        this.setState({manufacturers: manufacturers})
    }

    updateStrengths(){
        let strengths = []
        this.state.medicationRows.map(medicationRow => {
            if(!strengths.includes(medicationRow.strength))
                strengths.push(medicationRow.strength)
        })
        this.setState({strengths: strengths})
    }

    handleSelectedManufacturer = (selectedManufacturer) => {
        if(selectedManufacturer === this.state.selectedManufacturer){
            this.setState({selectedManufacturer: ''})
            this.filterRows(this.state.medicationFilter)
        }
        else{
            this.setState({selectedManufacturer: selectedManufacturer})
            this.filterRows(selectedManufacturer, 'manufacturer')
        }
    }

    handleWardSelect = (wardInfo) => {
        this.setState({selectedWard: wardInfo})
    }

    sendQuery(data){
        if(this.state.selectedWard){

            let body = {
                id: this.props.patientContext.patient.id,
                person_id: this.props.patientContext.patient.person.id,
                health_card_number: this.props.patientContext.patient.health_card_number,
                assigned_nurse_id: data.nurse_id,
                assigned_ward_id: this.state.selectedWard.id,
                admission_date: new Date().toISOString()
            }
            if(data.doc_id)
                body.assigned_doctor_id = data.doc_id;

            this.context.api.admitPatient(body)
            this.props.closeModal()
        }
    }

    render() {
        return (
            <div>
                <div className={styles.header}>
                    <div className={styles.title}>
                        Admit Patient                            
                    </div>
                    {this.state.selectedWard && <div className={styles.selectedWard}>{this.state.selectedWard.department_name} Floor: {this.state.selectedWard.floor} Room: {this.state.selectedWard.room}</div>}
                </div>
                <div className={styles.secondTitle}>
                    Search Parameters
                </div>
                <div className={styles.searchParamsContainer}>
                    <div className={styles.searchInputBox}><FontAwesomeIcon className={styles.searchIcon} icon={faSearch}/><input className={styles.searchInput} placeholder="Ward..." onChange={this.handleMedicationFilter.bind(this)}></input></div>
                    
                </div>
                <hr className={styles.horizontalRule}/>
                <div className={styles.tableContainer}><Table rows={this.state.medicationRows} header={this.header} onRowClick={this.handleWardSelect}/></div>
                <div className={styles.dosageInformation}>
                    <div className={styles.secondTitle}>Admit information</div>
                    <div>
                        <Form ref={this.form} onFinish={(data) => {
                                this.sendQuery(data)
                            }}>
                            <div className={styles.searchParamsContainer}>
                                
                                    <Input name={"nurse_id"} type="nurse" text={"Assigned nurse"} required/>
                                    <Input name={"doc_id"} type="doctor" text={"Assigned doctor"}/>
                                    <Button text="Admit patient" onClick={() => {this.form.current.save()}}/>

                            </div>

                        </Form>

                    </div>
                </div>
            </div>
        );
    }
}
AdmitPatient.contextType = Auth0Context
export default withPatientContext(AdmitPatient);