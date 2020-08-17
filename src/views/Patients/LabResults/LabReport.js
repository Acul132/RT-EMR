import React, { Component } from 'react'
import Table from 'components/Table/Table'
import {Auth0Context} from "../../../react-auth0-spa"
import Moment from 'react-moment'
import styles from './LabReport.module.css'


const header = ['test_name', 'reason', 'results', 'test_date', 'result_date'] ;

class LabReport extends Component {
    constructor(props){
        super(props);

        this.state = {
            rows: [{}]
        }
    }

    componentDidMount(){
        this.context.api.getPatientLabReports(this.props.match.params.id).then(labReports => {
            console.log(labReports)
            labReports = labReports.map(labReport => {
                let labObject = {
                    test_name: labReport.test_name,
                    reason: labReport.reason,
                    results: labReport.results,
                    test_date: <Moment format="YYYY-MM-DD h:mm:ss a">{labReport.test_date}</Moment>,
                    result_date: <Moment format="YYYY-MM-DD h:mm:ss a">{labReport.result_date}</Moment>, 
                    id: labReport.id
                }
                return labObject
            })
            this.setState({rows: labReports}) 
        })
    }

    render() {
        return (
            <div className={styles.root}>
                <Table rows={this.state.rows} header={header} viewable moduleName="Lab Report"/>
            </div>
        )
    }
}
LabReport.contextType = Auth0Context
export default LabReport
