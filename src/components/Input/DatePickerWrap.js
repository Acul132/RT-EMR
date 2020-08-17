import React, { Component } from 'react';
import DatePicker from 'react-datepicker'

class DatePickerWrap extends Component {
    constructor() {
        super()
        this.state = {
            date: new Date()
        }
    }

    get value() {
        console.log(this.state.date)
        return this.state.date.toISOString();
    }

    set value(val) {
        if(val == "") val = new Date().toISOString()
        this.setState({date: new Date(val)})
    }
    
    render() {
        return (
            <div>
                {!this.props.time && <DatePicker placeholderText={this.props.placeholderText} selected={this.state.date} onChange={(date) => {this.setState({date: date})}}/>}
                {this.props.time && <DatePicker  placeholderText={this.props.placeholderText} selected={this.state.date} onChange={(date) => {this.setState({date: date})}} showTimeSelect timeFormat="HH:mm" timeIntervals={15} timeCaption="Time" dateFormat="MMMM d, yyyy h:mm aa"/>}
            </div>
        );
    }
}

export default DatePickerWrap;