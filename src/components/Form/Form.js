import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Auth0Context } from 'react-auth0-spa';

class Form extends Component {

    constructor() {
        super()
        this.inputRef = [];
        
    }

    componentDidMount() {

    }

    save(data = {}) {
        if(!this.validate()) return;
        // let data = {};
        this.inputRef.forEach((input) => {
            data[input.current.name] = input.current.value;
        })
        

        //TODO: Send data to endpoint
        if(this.props.onFinish) {
            this.props.onFinish(data) //TODO: Return real id of patient
        }
    }

    reset(){
        for(let i = 0; i < this.inputRef.length; i++) {
            this.inputRef[i].current.reset();
        }
    }

    validate() {
        let error = null;
        for(let i = 0; i < this.inputRef.length; i++) {
            if(!this.inputRef[i].current.validate()) {
                if(!error) error = this.inputRef[i].current;
            }
        }
        if(error) {
            error.focus();
            return false;
        } else {
            return true;
        }
    }


    getInputChildren(children, tab = null) {

        let map = React.Children.map(children, child => {
            if(child.type.name == "Input") {
                this.inputRef.push(React.createRef())
                let newChild = React.cloneElement(child, {ref: this.inputRef[this.inputRef.length - 1], tab: tab});
                return newChild
            } else if(child.type.name == "TabView") {
                let tabRef = React.createRef()
                return React.cloneElement(child, {ref: tabRef}, this.getInputChildren(child.props.children, tabRef))
            }

            return React.cloneElement(child, {}, this.getInputChildren(child.props.children, tab))
        })
        return map;
    }

    render() {
        this.inputRef = [];
        const children = this.getInputChildren(this.props.children);
        return (
            <div>
                {children}
            </div>
        );
    }
}

Form.contextType = Auth0Context

export default Form;