import React, { Component } from 'react'
import {Auth0Context} from "../../react-auth0-spa"
import Moment from 'react-moment'
import styles from './Labs.module.css'
import Button from "../../components/Buttons/Button"
import Input from 'components/Input/Input'
import Form from "components/Form/Form"


class LabTestView extends Component {
    constructor(props){
        super(props);

        this.form = React.createRef();
        
        this.state = {
            result: {}
        }
    }
    render() {
        return (
            <div >
                <label className={styles.title}>Submit Lab Results for {this.props.data.patient_name}'s {this.props.data.test_name}</label>
                <hr className={styles.horizontalRule}/>
                <div className={styles.viewDetails}>
                    <div>
                        <label>Patient Name</label>
                        {this.props.data.patient_name}
                    </div>
                    <div className={styles.item}>
                        <label>Test Name</label>
                        {this.props.data.test_name}
                    </div>
                    <div className={styles.item}>
                        <label>Test Date</label>
                        <Moment format="YYYY-MM-DD h:mm:ss a">{this.props.data.result_date}</Moment>
                    </div>
                    <div className={styles.item}>
                        <label>Reason</label>
                        <pre>{this.props.data.reason}</pre>
                    </div>
                    <div className={styles.item}>
                        <label className={styles.inputLabel}>Results</label>
                        <div className={styles.input}>
                        <Form ref={this.form} onFinish={(data) => {
                            //send api
                            data = {reason: data.reason, id: data.id, patient_id: data.patient_id, results: data.results, 
                                test_date: data.test_date, result_date: new Date().toISOString(), test_name: data.test_name};
                                
                            if(data.reason){
                                try{
                                        this.context.api.updateLabResults(data).then(() => {
                                            console.log("data", data);
                                            this.props.onViewSaved();
                                            this.form.current.reset()
                                    });
                                }
                                catch(err){
                                    console.log(err)
                                }
                            }//else error modal
                        }}>
                            <Input name={"results"} type="textarea"/>
                        </Form>
                        </div>
                    </div>
                    <div className={styles.action}>
                        <Button text={"Submit Results"} onClick={() => {this.form.current.save(this.props.data)}}/>
                    </div>
                </div>
            </div>
        )
    }
}
LabTestView.contextType = Auth0Context
export default LabTestView