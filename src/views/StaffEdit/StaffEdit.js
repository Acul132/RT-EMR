import React, { Component } from 'react';
import styles from './StaffEdit.module.css'
import Tabs from 'components/Tabs/Tabs'
import TabView from 'components/Tabs/TabView';
import Input from 'components/Input/Input'
import Button from 'components/Buttons/Button'
import Form from "components/Form/Form"
import { Auth0Context } from 'react-auth0-spa';

class StaffEdit extends Component {
    constructor() {
        super()
        this.form = React.createRef();
        this.state = {
            staff: {position: {}, person: {location: {}}},
            edit: false
        }
    }

    componentDidMount() {
        this.setState({edit: this.props.match.path.includes("staff")})
        if(this.props.match.params.id && this.props.match.path.includes("staff")) {
            this.context.api.staffService().get(this.props.match.params.id).then((staff) => {
                console.log(staff)
                this.setState({
                    staff
                })
            })
        }
    }

    render() {

        //TODO Get patient data when editing and prefil inputs
        return (
          <div className={styles.root}>
              <div className={styles.container}>
                <div className={styles.header}>
                    <div>{this.state.edit ? "Edit" : "Create"} Staff</div>
                    <div className={styles.action}>
                        <Button text={"Save"} onClick={() => {this.form.current.save()}}/>
                    </div>
                </div>
                <Form endpoint={"/patient"} method={"POST"} ref={this.form} onFinish={(data) => {
                    let method = this.state.edit ? "PUT" : "POST"
                    let location = {
                        address: data.address,
                        city: data.city,
                        postal_code: data.postal_code,
                        province: data.province,
                        country: data.country
                    }
                    if(this.state.edit) location.id = this.state.staff.person.location_id
                    this.context.api.form("locations", method, location).then((result) => {
                        let person = {
                            dob: data.dob,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            phone_number: data.phone_number,
                            sex: data.sex,
                            location_id: this.state.edit ? this.state.staff.person.location_id : result.generated_keys[0]
                        }
                        if(this.state.edit) person.id = this.state.staff.person_id
                        this.context.api.form("persons", method, person).then((result1) => {

                            this.context.api.form('positions/' + data.position, "GET", {}).then((result2) => {
                                let staff = {
                                    licence_number: data.licence_number,
                                    person_id: (this.state.edit) ? this.state.staff.person_id : result1.generated_keys[0],
                                    position_id: result2[0].id,
                                    access: true,
                                    id: this.props.match.params.id
                                }
                                this.context.api.form("staff", "PUT", staff).then((result3) => {
                                    this.props.history.push("/admin/staff");
                                });
                            })
                        });
                    })

                    

                    
                }}>
                    <Tabs tabs={{ person: "Person", staff: "Staff", location: "Location"}} default={"person"} rounded>
                        <TabView view={"staff"}>
                            <div className={styles.editContent}>
                                <Input text={"License Number"} name={"licence_number"} required value={this.state.staff.licence_number}/>
                                <Input text={"Position"} name={"position"} required value={this.state.staff.position.position_name}/>

                            </div>
                        </TabView>
                        <TabView view={"person"}>
                            <div className={styles.editContent}>
                                <Input text={"First name"} name={"first_name"} required value={this.state.staff.person.first_name}/>
                                <Input text={"Last name"} name={"last_name"} required value={this.state.staff.person.last_name}/>
                                <Input text={"Date of birth"} name={"dob"} type={"date"} required value={this.state.staff.person.dob}/>
                                <Input text={"Phone number"} name={"phone_number"} required value={this.state.staff.person.phone_number}/>
                                <Input text={"Gender"} name={"sex"} required value={this.state.staff.person.sex}/>
                            </div>
                        </TabView>
                        <TabView view={"location"}>
                            <div className={styles.editContent}>
                                <Input text={"Street address"} name={"address"} required value={this.state.staff.person.location.address}/>
                                <Input text={"City"} name={"city"} required value={this.state.staff.person.location.city}/>
                                <Input text={"Province"} name={"province"} required value={this.state.staff.person.location.province}/>
                                <Input text={"Country"} name={"country"} required value={this.state.staff.person.location.country}/>
                                <Input text={"Postal Code"} name={"postal_code"} required value={this.state.staff.person.location.postal_code}/>
                            </div>
                        </TabView>
                    </Tabs>
                </Form>
            </div>
          </div>  
        );
    }
}
StaffEdit.contextType = Auth0Context

export default StaffEdit;