import React, { Component } from 'react';
import styles from './AddMedication.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCalendarDay, faEdit, faSearch, faPlus} from "@fortawesome/free-solid-svg-icons"
import Dropdown from 'components/Dropdowns/Dropdown'
import Table from 'components/Table/Table'
import {Auth0Context} from "../../react-auth0-spa"
import Button from 'components/Buttons/Button';
import Input from 'components/Input/Input'

const dropdown = ['apo', 'the', 'jecl', 'no', 'work']

class AddMedication extends Component {
    constructor(props){
        super(props)

        this.state = {
            medicationRows : [],
            medicationFilter: '',
            selectedManufacturer: '',
            selectedStrength: '',
            selectedDoctor: '',
            sig: '',
            dailyQuantity: '',
            selectedMedication: {},
            manufacturers : [],
            strengths: [],
            doctors: []
        }
        this.doctorInput = React.createRef();
        this.header = ["din", "drug_name", "manufacturer", "strength"]
    }

    handleMedicationFilter(event) {
        this.setState({medicationFilter:event.target.value})
        this.context.api.searchMedications(event.target.value).then(medications => {
            medications = medications.map(medication => {
                let medicationObject = {
                    din: medication.din,
                    drug_name: medication.name,
                    manufacturer: medication.manufacturer,
                    strength: medication.strength+' '+medication.unit_of_measure,
                    id: medication.id
                }
                return medicationObject
            })
            this.setState({medicationRows:medications})
            this.updateManufacturers();
            this.updateStrengths();
        })
    }

    handleDailyQuantity(event){
        this.setState({dailyQuantity: event.target.value})
    }

    handleSig(event){
        this.setState({sig: event.target.value})
    }

    filterRows(filter, field='drug_name', filterType='includes'){
        if(filterType === 'includes'){
            this.setState(prevState => ({medicationRows: prevState.medicationRows.filter(row => row[field].toUpperCase().includes(filter.toUpperCase()))}))
            this.updateStrengths()
        }
        else if(filterType ==='equals'){
            this.setState(prevState => ({medicationRows: prevState.medicationRows.filter(row => row[field].toUpperCase() === filter.toUpperCase())}))
            this.updateManufacturers()
        }
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

    handleSelectedStrength = (selectedStrength) => {
        this.filterRows(selectedStrength, 'strength', 'equals')
    }

    handleMedicationSelect = (medicationInfo) => {
        this.setState({selectedMedication: medicationInfo})
    }

    sendQuery(){
        if(this.state.selectedMedication && this.state.dailyQuantity && this.state.sig && this.doctorInput.current.validate()){
            try{
                let body = {
                    doctor_id: this.doctorInput.current.value,
                    medication_id: this.state.selectedMedication.id,
                    daily_quantity: parseFloat(this.state.dailyQuantity),
                    sig: this.state.sig.toUpperCase(),
                    administered_date: new Date().toISOString()
                }
                this.props.handleAddMedication(body)
            }
            catch(err){
                console.log(err)
            }
        }
    }

    render() {
        return (
            <div>
                <div className={styles.header}>
                    <div className={styles.title}>
                        Add Medication
                    </div>
                    {this.state.selectedMedication && <div className={styles.selectedMedication}>{this.state.selectedMedication.drug_name} {this.state.selectedMedication.strength}</div>}
                </div>
                <div className={styles.secondTitle}>
                    Search Parameters
                </div>
                <div className={styles.searchParamsContainer}>
                    <div className={styles.searchInputBox}><FontAwesomeIcon className={styles.searchIcon} icon={faSearch}/><input className={styles.searchInput} placeholder="Medication Name..." onChange={this.handleMedicationFilter.bind(this)}></input></div>
                    <Dropdown list={this.state.manufacturers} title="Manufacturer" searchable onSelect={this.handleSelectedManufacturer}/>
                    <Dropdown list={this.state.strengths} title="Strength" onSelect={this.handleSelectedStrength}/>
                </div>
                <hr className={styles.horizontalRule}/>
                <div className={styles.tableContainer}><Table rows={this.state.medicationRows} header={this.header} onRowClick={this.handleMedicationSelect}/></div>
                <div className={styles.dosageInformation}>
                    <div className={styles.secondTitle}>Dosage Information</div>
                    <div className={styles.footer}>
                        <div className={styles.dosageParamsContainer}>
                            <div className={styles.searchInputBox}><FontAwesomeIcon className={styles.searchIcon} icon={faCalendarDay}/><input className={styles.searchInput} placeholder="Daily Quantity" onChange={this.handleDailyQuantity.bind(this)}></input></div>
                            <div className={styles.searchInputBox}><FontAwesomeIcon className={styles.searchIcon} icon={faEdit}/><input className={styles.searchInput} placeholder="SIG" onChange={this.handleSig.bind(this)}></input></div>
                            <Input className={styles.specialInput} type="doctor" title="Prescribing Doctor" ref={this.doctorInput}/>
                        </div>
                        <Button text="Add Medication" icon={faPlus} onClick={() => this.sendQuery()}></Button>
                    </div>
                </div>
            </div>
        );
    }
}
AddMedication.contextType = Auth0Context
export default AddMedication;