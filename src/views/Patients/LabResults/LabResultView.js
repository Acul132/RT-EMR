import React, { Component } from 'react'
import {Auth0Context} from "../../../react-auth0-spa"
import Moment from 'react-moment'
import styles from './LabResultView.module.css'
import Tabs from 'components/Tabs/Tabs'
import TabView from 'components/Tabs/TabView';
import PageHeader from 'components/PageHeader/PageHeader';



class LabResultView extends Component {
    constructor(props){
        super(props);

        this.state = {
            result: {}
        }
    }

    componentDidMount(){
        this.context.api.getLabTest(this.props.match.params.labid).then(labTest => {
            console.log("lab test", labTest);
            let labObject = {
                test_name: labTest.test_name,
                reason: labTest.reason,
                results: labTest.results,
                test_date: labTest.test_date,
                result_date: labTest.result_date,
                id: labTest.id
            }
            this.setState({result: labObject})
            console.log("result", this.state.result);

        })
    }

    render() {
        return (
            <div className={styles}>
                <PageHeader title={`${this.state.result.test_name}`} tabbed back="Lab Reports"></PageHeader>
                <Tabs tabs={{details: "Details"}} default={"details"}>
                    <TabView view={"details"}>
                        <div className={styles.viewDetails}>
                            <div>
                                <label>Test Name</label>
                                {this.state.result.test_name}
                            </div>
                            <div className={styles.item}>
                                <label>Test Date</label>
                                <Moment format="YYYY-MM-DD h:mm:ss a">{this.state.result.result_date}</Moment>
                            </div>
                            <div className={styles.item}>
                                <label>Reason</label>
                                <pre>{this.state.result.reason}</pre>
                            </div>
                            <div className={styles.item}>
                                <label>Results</label>
                                <pre>{this.state.result.results}</pre>
                            </div>
                            <div className={styles.item}>
                                <label>Results Date</label>
                                <Moment format="YYYY-MM-DD h:mm:ss a">{this.state.result.test_date}</Moment>
                            </div>
                        </div>
                    </TabView>
                </Tabs>
            </div>
        )
    }
}
LabResultView.contextType = Auth0Context
export default LabResultView