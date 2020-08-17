import React, { useEffect } from 'react';
import { Container, Row, Col } from 'styled-bootstrap-grid';
import {useHistory} from 'react-router-dom'
import PageHeader from 'components/PageHeader/PageHeader'
import Button from 'components/Buttons/Button'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import SummaryCard from 'views/Patients/Cards/SummaryCard/SummaryCard'
import VitalsCard from "views/Patients/Cards/VitalsCard/VitalsCard"
import VisitCard from 'views/Patients/Cards/VisitCard/VisitCard'
import MedicationsCard from 'views/Patients/Cards/MedicationsCard/MedicationsCard'
import AllergiesCard from 'views/Patients/Cards/AllergiesCard'
import { usePatient } from 'PatientContext';
import Modal from 'components/Modal/Modal'
import AdmitPatient from './AdmitPatient';
import TransferPatient from './TransferPatient';
import { useAuth0 } from "react-auth0-spa";

function Summary ({match}) {
    let history = useHistory();
    let {patient, loading} = usePatient();
    let admitModal = React.createRef();
    let transferModal = React.createRef();
    let {api} = useAuth0();

    const dischargePatient = (patientInfo) => {
        let body = {
            id: patientInfo.id,
            person_id: patientInfo.person_id,
            health_card_number: patientInfo.health_card_number,
            assigned_nurse_id: patientInfo.assigned_nurse_id,
            assigned_ward_id: patientInfo.assigned_ward_id,
            discharge_date: new Date().toISOString()
        }
        if(patientInfo.assigned_doctor_id)
            body.assigned_doctor_id = patientInfo.assigned_doctor_id

        api.dischargePatient(body)
    }

 

    return (
        <div>
            <PageHeader title="Summary">
                <Button icon={faEdit} text="Edit" secondary onClick={() => {history.push(`/patient/edit/${match.params.id}`)}}></Button>
                {!loading && !patient.ward && <Button text="Admit" secondary onClick={() => {admitModal.current.show()}}></Button>}
                {!loading && patient.ward && <Button text="Transfer" secondary onClick={() => {transferModal.current.show()}}></Button>}
                {!loading && patient.ward && <Button text="Discharge" secondary onClick={() => {dischargePatient(patient)}}></Button>}
            </PageHeader>
            <Container >
                <Row>
                    <Col md={12} lg={9} xl={6}>
                        <SummaryCard/>
                    </Col>
                    <Col sm={12} md={6} lg={3} xl={3}>
                        <VitalsCard/>
                    </Col>
                    <Col sm={12} md={6} lg={3} xl={3}>
                        <VisitCard/>
                    </Col>
                </Row>
            </Container>
            <Modal ref={admitModal} >
                <AdmitPatient closeModal={() => admitModal.current.close()}/>
            </Modal>
            <Modal ref={transferModal} >
                <TransferPatient closeModal={() => transferModal.current.close()}/>
            </Modal>
        </div>
    )
}

export default Summary;