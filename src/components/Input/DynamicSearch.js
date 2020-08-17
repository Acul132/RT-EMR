import React, { Component } from 'react';
import {Auth0Context} from 'react-auth0-spa'
import styles from './Input.module.css'


class DynamicSearch extends Component {

    constructor(props) {
        super(props)
        this.input = React.createRef();
        this.state = {
            options: [],
            focused: false
        }
        this._value = ""
    }

    onInput() {
        this.context.api.searchStaff(this.input.current.value, this.props.type).then(val => {
            let options = val.map((v) => {
                return {label: v.first_name + " " + v.last_name, value: v.id}
            })
            this.setState({options})
        })
    }

    selectVal(v) {
        console.log(v)
        this.input.current.value = v.label;
        this._value = v.value;
        this.setState({focused: false})
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
    }

    focus() {
        this.input.current.focus();
    }

    render() {
        return (
            <div className={styles.dyanmicContainer}>
                <input ref={this.input} placeholder={this.props.placeholder ? this.props.placeholder : ""} onInput={() => {this.onInput()}} onFocus={() => {this.setState({focused: true})}} />
                <div className={styles.dynamicDrop} style={{display: this.state.focused ? "" : "none"}}>
                    <ul>
                        {this.state.options.length === 0 && this.input.current && !this.input.current.value && <li>Please search for {this.props.type}</li>}
                        {this.state.options.length === 0 && this.input.current && this.input.current.value && <li>Not results for {this.input.current.value}</li>}
                        {this.state.options.map((v, index) => {
                            return <li key={index} onClick={(e) => {e.stopPropagation(); this.selectVal(v)}}>{v.label}</li>
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}
DynamicSearch.contextType = Auth0Context
export default DynamicSearch;
