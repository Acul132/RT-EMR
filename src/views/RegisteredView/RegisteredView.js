import React, { Component } from 'react';
import Table from 'components/Table/Table';
import { Auth0Context } from 'react-auth0-spa';

class RegisteredView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rows : []
        }
    }

    componentDidMount() {
        this.context.api.getPendingStaff().then((data) => {
            this.setState({rows: data})
        })
        this.context.api.staffService().subscribePending((data) => {
            console.log(data)
            let row = this.state.rows;
            row.push(data)
            this.setState({rows: row})
        })
    }
    render() {
        return (
            <div style={{height: "100%"}}>

                <Table rows={this.state.rows} header={['email', 'auth0']} moduleName="Admin Panel" viewable />
            </div>
        );
    }
}
RegisteredView.contextType = Auth0Context
export default RegisteredView;