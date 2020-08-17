import React, { Component } from 'react';
import DatePickerWrap from './DatePickerWrap'
import "react-datepicker/dist/react-datepicker.css";
import "./Input.datepicker.css"
import styles from "./Input.module.css"
import DynamicSearch from './DynamicSearch';


class Input extends Component {

    constructor() {
        super()
        this.input = React.createRef();
        
        this.state = {error: ""}
        
    }

    componentDidMount() {
        if(this.props.type === "date" || this.props.type === "time") {
            this.setState({date: new Date()})
        }
    }

    focus() {
        if(this.props.tab) {
            this.props.tab.current.props.open();
            setTimeout(() => {
                this.input.current.focus();
            }, 0)
        }
    }

    validate() {

        if(!this.props.required) return true;
        if(this.input.current.value === "") {
            this.setState({error: "Required"})
            return false; 
        } else {
            if(this.state.error) {
                this.setState({error: ""})
            }
            return true;
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value) {
            this.input.current.value = this.props.value
        }
    }

    get value() {
        return this.input.current.value
    }
    
    reset() {
        this.input.current.value = "";
    }


    get name() {
        return this.props.name
    }

    render() {
        return (
            <div className={`${styles.container} ${this.state.error ? styles.error : ""} ${this.props.className}`}>
                {this.props.text && <label>{this.props.text}</label>}
                {(!this.props.type || this.props.type === "text") &&  <input ref={this.input} type="text" name={this.props.name} onChange={(date) => {this.setState({date: date})}}/>}
                {this.props.type === "date" && <DatePickerWrap ref={this.input} placeholderText={this.props.placeholderText}/>}
                {this.props.type === "time" && <DatePickerWrap ref={this.input} time placeholderText={this.props.placeholderText}/>}
                {this.props.type === "textarea" && <textarea ref={this.input} name={this.props.name}></textarea>}
                {this.props.type === "doctor" && <div><DynamicSearch type="Doctor" ref={this.input} placeholder={"Search"}/></div>}
                {this.props.type === "nurse" && <div><DynamicSearch type="Nurse" ref={this.input} placeholder={"Search"}/></div>}



                <span>{this.state.error}</span>
            </div>
        );
    }
}

export default Input;