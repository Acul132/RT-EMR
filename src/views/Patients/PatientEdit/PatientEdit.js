import React, { Component } from 'react';
import styles from './PatientEdit.module.css'
import Tabs from 'components/Tabs/Tabs'
import TabView from 'components/Tabs/TabView';
import Input from 'components/Input/Input'
import Button from 'components/Buttons/Button'
import Form from "components/Form/Form"
import { Auth0Context } from 'react-auth0-spa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

class PatientEdit extends Component {
    constructor() {
        super()
        this.form = React.createRef();
        this.state = {
            patient: {person: {location: {}}},
            edit: false
        };
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            this.setState({edit: true});
            this.context.api.patientService().get(this.props.match.params.id).then((patient) => {
                this.setState({patient})
            })
        }
    }

    render() {

        //TODO Get patient data when editing and prefil inputs
        return (
          <div className={styles.root}>
              <div className={styles.container}>
                <div className={styles.header}>
                    
                    <div style={{display: "flex",alignItems: "center"}}><div style={{color: "#768191", fontSize: 20, display: "flex", cursor: "pointer", marginRight: "8px", alignItems: "center"}} onClick={() => {this.props.history.goBack()}}><FontAwesomeIcon icon={faChevronLeft} style={{marginRight: 8}}/> Back - </div> {this.state.edit ? "Edit" : "Create"} patient</div>
                    <div className={styles.action}>
                        <Button text={"Save"} onClick={() => {this.form.current.save()}}/>
                    </div>
                </div>
                <Form endpoint={"/patient"} method={"POST"} ref={this.form} onFinish={(data) => {
                    let method = (this.state.edit) ? "PUT" : "POST";
                    let location = {
                        address: data.address,
                        city: data.city,
                        postal_code: data.postal_code,
                        province: data.province,
                        country: data.country
                    }
                    
                    if(this.state.edit) location.id = this.state.patient.person.location_id
                    console.log(location)
                    this.context.api.form("locations", method, location).then((result) => {
                        let person = {
                            dob: data.dob,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            phone_number: data.phone_number,
                            sex: data.sex,
                            location_id: (this.state.edit) ? this.state.patient.person.location_id : result.generated_keys[0]
                        }
                        if(this.state.patient) person.id = this.state.patient.person_id
                        console.log(person)
                        this.context.api.form("persons", method, person).then((result1) => {
                            let patient = {
                                health_card_number: data.health_card_number,
                                person_id: (this.state.edit) ? this.state.patient.person_id : result1.generated_keys[0],
                            }
                            if(this.state.edit) patient.id = this.state.patient.id
                            console.log(patient)
                            this.context.api.form("patients", method, patient).then((result2) => {
                                console.log(this.state.patient)
                                let _id = (this.state.edit) ? this.state.patient.id : result2.generated_keys[0];
                                this.props.history.push("/patient/" + _id + "/summary");
                            });
                        });
                    });
                }}>
                    <Tabs tabs={{person: "Person", patient: "Patient", location: "Location"}} default={"person"} rounded>
                        <TabView view={"patient"}>
                            <div className={styles.editContent}>
                                <Input text={"Health Card Number"} name={"health_card_number"} required value={this.state.patient.health_card_number}/>
                            </div>
                        </TabView>
                        <TabView view={"person"}>
                            <div className={styles.editContent}>
                                <Input text={"First name"} name={"first_name"} required value={this.state.patient.person.first_name}/>
                                <Input text={"Last name"} name={"last_name"} required value={this.state.patient.person.last_name}/>
                                <Input text={"Date of birth"} name={"dob"} type={"date"} required placeholderText={"Please select date"} value={this.state.patient.person.dob}/>
                                <Input text={"Phone number"} name={"phone_number"} required value={this.state.patient.person.phone_number}/>
                                <Input text={"Gender"} name={"sex"} required value={this.state.patient.person.sex}/>
                            </div>
                        </TabView>
                        <TabView view={"location"}>
                            <div className={styles.editContent}>
                                <Input text={"Street Address"} name={"address"} required value={this.state.patient.person.location.address}/>
                                <Input text={"City"} name={"city"} required value={this.state.patient.person.location.city}/>
                                <Input text={"Province"} name={"province"} required value={this.state.patient.person.location.province}/>
                                <Input text={"Country"} name={"country"} required value={this.state.patient.person.location.country}/>
                                <Input text={"Postal Code"} name={"postal_code"} required value={this.state.patient.person.location.postal_code}/>
                            </div>
                        </TabView>
                    </Tabs>
                </Form>
            </div>
          </div>  
        );
    }
}
PatientEdit.contextType = Auth0Context

export default PatientEdit;