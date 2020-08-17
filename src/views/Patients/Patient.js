import React from 'react';
import {Sidebar, SidebarWrapper, SidebarHeader, SidebarLink} from "../../components/SideBar"
import { faTh, faSyringe, faAllergies, faFileInvoice, faFlask, faDiagnoses, faUsers, faFile, faTasks, faProcedures, faDoorOpen, faDoorClosed, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faCalendarCheck, faEdit, faCalendarPlus, faHandshake } from '@fortawesome/free-regular-svg-icons'
import MedicationView from './MedicationView'
import Medication  from './Medication'
import Admissions  from './Admissions'
import Transfers  from './Transfers'
import Discharges  from './Discharges'
import LabReport from './LabResults/LabReport'
import LabResultView from './LabResults/LabResultView'
import Card from "components/Card/Card"
import { Container, Row, Col } from 'styled-bootstrap-grid';
import {useHistory} from 'react-router-dom'
import styles from "./Patients.module.css"

import PrivateRoute from "../../components/PrivateRoute"
import PageHeader from 'components/PageHeader/PageHeader';
import Button from 'components/Buttons/Button';
import Tabs from 'components/Tabs/Tabs'
import TabView from 'components/Tabs/TabView';
import Table from 'components/Table/Table'
import MultiFab from 'components/Buttons/MultiFab';
import Fab from 'components/Buttons/Fab';
import Modal from 'components/Modal/Modal';
import Input from 'components/Input/Input'
import Form from 'components/Form/Form'
import Appointments from "./PatientPages/Appointments/Appointments"
import Summary from './PatientPages/Summary/Summary'
import { PatientProvider, PatientContext } from 'PatientContext';
import {Auth0Context, useAuth0} from "../../react-auth0-spa"




function Patient({match}) {
    const {api} = useAuth0();
    const consultModal = React.createRef()
    const consultForm = React.createRef()
    const proceduresModal = React.createRef()
    const proceduresForm = React.createRef()
    const labtestModal = React.createRef()
    const labtestForm = React.createRef()
    const doctorInput = React.createRef()

    return (
        <PatientProvider id={match.params.id}>
            <SidebarWrapper>
                <Sidebar>
                    <SidebarHeader text="Patient"/>
                    <PatientContext.Consumer>
                        {patientContext => 
                            <div>{!patientContext.loading && <SidebarHeader style={{fontSize: 20, color: "black"}} text={`${patientContext.patient.person.first_name} ${patientContext.patient.person.last_name}`}/>}</div>
                        }
                    </PatientContext.Consumer>
                    <SidebarLink icon={faTh} text="Summary" path={`/patient/${match.params.id}/summary`}/>
                    <SidebarLink icon={faSyringe} text="Medications" path={`/patient/${match.params.id}/medications`}/>
                    <SidebarLink icon={faCalendarCheck} text="Appointments" path={`/patient/${match.params.id}/appointments`}/>
                    <SidebarLink icon={faFlask} text="Lab Reports" path={`/patient/${match.params.id}/labreports`}/>
                    <SidebarLink icon={faDoorOpen} text="Admissions" path={`/patient/${match.params.id}/admissions`}/>
                    <SidebarLink icon={faExchangeAlt} text="Transfers" path={`/patient/${match.params.id}/transfers`}/>
                    <SidebarLink icon={faDoorClosed} text="Discharges" path={`/patient/${match.params.id}/discharges`}/>
                </Sidebar>
            <PrivateRoute path={`/patient/:id/summary`} component={Summary}/>
            <PrivateRoute exact path={`/patient/:id/medications`} component={Medication}/>
            <PrivateRoute path={`/patient/:id/appointments`} component={Appointments}/>
            <PrivateRoute exact path={`/patient/:id/labreports`} component={LabReport}/>
            <PrivateRoute path={`/patient/:id/admissions`} component={Admissions}/>
            <PrivateRoute path={`/patient/:id/transfers`} component={Transfers}/>
            <PrivateRoute path={`/patient/:id/discharges`} component={Discharges}/>
            <PrivateRoute exact path={`/patient/:id/medications/:medicationId`} component={MedicationView} />
            <PrivateRoute exact path={`/patient/:id/labreports/:labid`} component={LabResultView} />


                <MultiFab icon={faCalendarPlus}>
                    <Fab icon={faProcedures} tooltip={"Schedule Procedures"} onClick={() => {proceduresModal.current.show()}}/>
                    <Fab icon={faHandshake} tooltip={"Schedule Consult"} onClick={() => {consultModal.current.show()}}/>
                    <Fab icon={faFlask} tooltip={"Schedule Lab test"} onClick={() => {labtestModal.current.show()}}/>
                </MultiFab>
                <PatientContext.Consumer>
                    {patientContext => 
                        <div>
                            <Modal ref={consultModal} title={"Schedule Consult"}>
                                <Form ref={consultForm} onFinish={(data) => {
                                    data = {reason: data.reason, patient_id: patientContext.patient.id,
                                        consult_date: data.consult_date, consult_type: data.consult_type, 
                                        doctor_id: patientContext.patient.assigned_doctor_id};
                                    console.log("data", data);
                                    if(data.reason && data.consult_date && data.consult_type){
                                        try{
                                            api.createConsult(data).then(() => {
                                                console.log("data", data);
                                                consultModal.current.close()
                                                consultForm.current.reset()
                                            });
                                        }
                                        catch(err){
                                            console.log(err)
                                        }
                                    }
                                }}>
                                    <Input text={"Consult Type"} name={"consult_type"} type={"text"}/>
                                    <Input text={"Consult Date"} name={"consult_date"} type={"time"}/>
                                    <Input text={"Reason"} name={"reason"} type={"textarea"}/>
                                    <Button text={"Confirm appointment"} onClick={() => {consultForm.current.save()}}/>
                                </Form>
                            </Modal>
                            <Modal ref={proceduresModal} title={"Schedule Procedure"}>
                                <Form ref={proceduresForm} onFinish={(data) => {
                                    data = {reason: data.reason, patient_id: patientContext.patient.id,
                                        procedure_date: data.procedure_date, procedure_type: data.procedure_type, 
                                        doctor_id: patientContext.patient.assigned_doctor_id};
                                    console.log("data", data);
                                    if(data.reason && data.procedure_date && data.procedure_type){
                                        try{
                                            api.createProcedure(data).then(() => {
                                                console.log("data", data);
                                                proceduresModal.current.close()
                                                proceduresForm.current.reset()
                                            });
                                        }
                                        catch(err){
                                            console.log(err)
                                        }
                                    }
                                }}>
                                    <Input text={"Procedure Type"} name={"procedure_type"} type={"text"}/>
                                    {/* <Input className={styles.specialInput} type="doctor" title="Doctor" ref={doctorInput}/> */}
                                    <Input text={"Procedure Date"} name={"procedure_date"} type={"time"}/>
                                    <Input text={"Reason"} name={"reason"} type={"textarea"}/>

                                    <Button text={"Confirm appointment"} onClick={() => {proceduresForm.current.save()}}/>
                                </Form>
                            </Modal>
                            <Modal ref={labtestModal} title={"Schedule Lab Test"}>
                                <Form ref={labtestForm} onFinish={(data) => {
                                    data = {reason: data.reason, patient_id: patientContext.patient.id,
                                        test_date: data.test_date, test_name: data.test_name};
                                    if(data.reason && data.test_date && data.test_name){
                                        try{
                                            api.createLabTest(data).then(() => {
                                                console.log("data", data);
                                                labtestModal.current.close()
                                                labtestForm.current.reset()
                                            });
                                        }
                                        catch(err){
                                            console.log(err)
                                        }
                                    }
                                    //else error toastr
                                    
                                }}>
                                    <Input text={"Test type"} name={"test_name"} type={"text"}/>
                                    <Input text={"Test date"} name={"test_date"} type={"time"}/>
                                    <Input text={"Reason"} name={"reason"} type={"textarea"}/>
                                    <Button text={"Confirm appointment"} onClick={() => {labtestForm.current.save()}}/>
                                </Form>
                            </Modal>
                            {console.log("patient context", patientContext)}
                        </div>
                    }
                </PatientContext.Consumer>
            </SidebarWrapper>
        </PatientProvider>
    );
}

function Medications () {
    return (
        <div>Meds</div>
    )
}
function Alergies () {
    return (
        <div>Alergies</div>
    )
}

function Orders () {
    return (
        <div>Orders</div>
    )
}
function LabReports () {
    return (
        <div>LabReports</div>
    )
}
function Problems () {
    return (
        <div>Problems</div>
    )
}
function Family () {
    return (
        <div>Family</div>
    )
}
function Documents () {
    return (
        <div>Documents</div>
    )
}
function Tasks () {
    return (
        <div>Tasks</div>
    )
}
export default Patient;