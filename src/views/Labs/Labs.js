import React, { Component } from 'react'
import Table from 'components/Table/Table'
import {Auth0Context} from "../../react-auth0-spa"
import Moment from 'react-moment'
import Modal from 'components/Modal/Modal'
import LabTestView from './LabTestView'
import styles from './Labs.module.css'

const header = ['patient_name', 'test_name', 'reason', 'modified_test_date'];

class LabReport extends Component {
    constructor(props){
        super(props);

        this.state = {
            showModal: false,
            rows: [{}],
            currentRow: {}
        }
        this.modal = React.createRef();
    }

    componentDidMount(){
        this.context.api.getAllLabTests().then(labReports => {
            labReports = labReports.map(labReport => {
                let labObject = {
                    patient_name: labReport.first_name + " " + labReport.last_name,
                    test_name: labReport.test_name,
                    reason: labReport.reason,
                    modified_test_date: <Moment format="YYYY-MM-DD h:mm:ss a">{labReport.test_date}</Moment>,
                    test_date: labReport.test_date,
                    id: labReport.id,
                    patient_id: labReport.patient_id
                }
                return labObject
            })
            this.setState({rows: labReports})
        })
    }

    render() {
        return (
            <div className={styles.root}>
                <Table rows={this.state.rows} header={header} onRowClick={(data) => {this.setState({currentRow: data}); this.modal.current.show()}} moduleName="Lab Tests"/>
                <Modal ref={this.modal} >
                    <LabTestView onViewSaved={() => this.modal.current.close()} data={this.state.currentRow}/>
                </Modal>
            </div>
        )
    }
}
LabReport.contextType = Auth0Context
export default LabReport
