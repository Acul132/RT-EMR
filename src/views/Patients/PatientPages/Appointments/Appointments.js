import React, { Component } from 'react';
import styles from './Appointments.module.css'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import Moment from 'react-moment'
import moment from 'moment'
import './Calendar.scss'
import PageHeader from 'components/PageHeader/PageHeader';
import Button from 'components/Buttons/Button'
import Modal from 'components/Modal/Modal'
import { Auth0Context } from 'react-auth0-spa';
const localizer = momentLocalizer(moment)


class Appointments extends Component {

    constructor(props) {
        super(props)
        //TODO: Get patients appointments

        this.cancelModal = React.createRef();
        this.state = {
            viewing: {},
            events: []
        }
    }

    componentDidMount() {
        this.renderEvents();
    }

    renderEvents(){
        this.context.api.patientService().appointments(this.props.match.params.id).then((appointments) => {
            console.log(appointments)
            let events = [];
            for(let consult in appointments.consults) {
                let c = appointments.consults[consult];
                let date = new Date(c.consult_date);
                let end = date.setHours(date.getHours() + 1);
                events.push({title: "General Consult: " + c.consult_type, start: date, end: new Date(end), resources: c})
            }
            for(let test in appointments.lab_tests) {
                let t = appointments.lab_tests[test];
                let date = new Date(t.test_date);
                let end = date.setHours(date.getHours() + 1);
                events.push({title: "Lab Test: " + t.test_name, start: date, end: new Date(end), resources: t})
            }
            for(let proc in appointments.procedures) {
                let p = appointments.procedures[proc];
                let date = new Date(p.procedure_date);
                let end = date.setHours(date.getHours() + 1);
                events.push({title: "Procedure: " + p.procedure_type, start: date, end: new Date(end), resources: p})
            }
            console.log(events)
            this.setState({events})
        })
    }

    sendQuery(data){
        if(data.title.includes("Lab Test")){
            try{
                this.context.api.deleteLabTest(data.resources.id).then(() => {
                    console.log("worked", data);
                });
            }
            catch(err){
                console.log(err);
            }
        }
        else if(data.title.includes("Procedure")){
            try{
                this.context.api.deleteProcedure(data.resources.id).then(() => {
                    console.log("worked", data);
                });
            }
            catch(err){
                console.log(err);
            }
        }
        else if(data.title.includes("General Consult")){
            try{
                this.context.api.deleteConsult(data.resources.id).then(() => {
                    console.log("worked", data);
                });
            }
            catch(err){
                console.log(err);
            }
        }
        this.cancelModal.current.close();
        setTimeout(() => {
            this.renderEvents();
        }, 300)
    }

    render() {
        return (
            <div className={styles.root}>
                <PageHeader title={"Appointments"}>

                </PageHeader>
                <div className={styles.container}>
                    <div>
                        <Calendar
                            localizer={localizer}
                            events={this.state.events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{height: "100%"}} 
                            onSelectEvent={(e) => {this.setState({viewing: e}); this.cancelModal.current.show()}}
                        />
                    </div>
                </div>
                <Modal ref={this.cancelModal}>
                    {console.log("viewing", this.state.viewing)}
                    <div className={styles.modalTitle}>{this.state.viewing.title}</div>
                    <div className={styles.modalDate}><Moment format="YYYY-MM-DD h:mm:ss a">{this.state.viewing.start}</Moment></div>
                    <Button text={"Cancel Appointment"}/>
                </Modal>
            </div>
        );
    }
}
Appointments.contextType = Auth0Context
export default Appointments;