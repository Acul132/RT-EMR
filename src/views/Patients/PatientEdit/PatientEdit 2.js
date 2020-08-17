import React, { Component } from 'react';
import styles from './PatientEdit.module.css'
import Tabs from 'components/Tabs/Tabs'
import TabView from 'components/Tabs/TabView';
import Input from 'components/Input/Input'
import Button from 'components/Buttons/Button'
import Form from "components/Form/Form"

class PatientEdit extends Component {
    constructor() {
        super()
        this.form = React.createRef();
        this.state = {edit: false};
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            this.setState({edit: true});
        }
    }

    render() {

        //TODO Get patient data when editing and prefil inputs
        return (
          <div className={styles.root}>
              <div className={styles.container}>
                <div className={styles.header}>
                    <div>{this.state.edit ? "Edit" : "Create"} patient</div>
                    <div className={styles.action}>
                        <Button text={"Save"} onClick={() => {this.form.current.save()}}/>
                    </div>
                </div>
                <Form endpoint={"/patient"} method={"POST"} ref={this.form} onFinish={({id}) => {
                    this.props.history.push(`/patient/${id}/summary`)
                }}>
                    <Tabs tabs={{person: "Person", location: "Location"}} default={"person"} rounded>
                        <TabView view={"person"}>
                            <div className={styles.editContent}>
                                <Input text={"First name"} name={"first_name"}/>
                                <Input text={"Last name"} name={"last_name"}/>
                                <Input text={"Date of birth"} name={"dob"}/>
                                <Input text={"Phone number"} name={"phone"}/>
                                <Input text={"Gender"} name={"gender"}/>
                            </div>
                        </TabView>
                        <TabView view={"location"}>
                            <div className={styles.editContent}>
                                <Input text={"Street name"} name={"street_name"}/>
                                <Input text={"Street number"} name={"street_number"}/>
                                <Input text={"City"} name={"city"}/>
                                <Input text={"Province"} name={"province"}/>
                                <Input text={"Country"} name={"country"}/>
                                <Input text={"Postal Code"} name={"postal_code"}/>
                            </div>
                        </TabView>
                    </Tabs>
                </Form>
            </div>
          </div>  
        );
    }
}

export default PatientEdit;