import React, { Component } from 'react';
import Table from 'components/Table/Table';
import { Auth0Context } from 'react-auth0-spa';

class StaffView extends Component {
    constructor() {
        super()
        this.state = {
            rows : []
        }
        this.input = React.createRef();
    }

    onInput() {
        this.context.api.staffService().search(this.input.current.value).then((result) => {
            result = result.map((v) => { v.position_name = v.position_name.replace("_", " "); return v})
            this.setState({rows: result})
        })
    }

    render() {
        const search = [
            <input type="text" placeholder="Search staff..." ref={this.input} onInput={() => {this.onInput()}}/>
        ]
        return (
            <div style={{height: "100%"}}>
                
                <Table rows={this.state.rows} header={['first_name', 'last_name', "position_name"]} moduleName="Staff registry" viewable additionalFields={search}/>
            </div>
        );
    }
}
StaffView.contextType = Auth0Context
export default StaffView;