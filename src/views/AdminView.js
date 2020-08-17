import React, { Component } from 'react';
import Table from 'components/Table/Table';
import { Auth0Context } from 'react-auth0-spa';
import { SidebarWrapper, Sidebar, SidebarHeader, SidebarLink } from 'components/SideBar';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import PrivateRoute from 'components/PrivateRoute';
import StaffView from 'views/StaffView/StaffView'
import RegisterdView from 'views/RegisteredView/RegisteredView'


class AdminView extends Component {

    constructor() {
        super()

        this.state = {
            rows : []
        }

    }

    componentDidMount() {
        
        this.context.api.staffService().search("Rose").then((result) => console.log(result))
        this.context.api.staffService().get().then((result) => {

        })
    }

    render() {
        const search = [
            
        ]
        return (
            <SidebarWrapper>
                <Sidebar>
                    <SidebarHeader text="Admin Panel"/>
                    <SidebarLink icon={faUser} text="Staff" path={`/admin/staff`}/>
                    <SidebarLink icon={faUser} text="Registered" path={`/admin/registered`}/>
                </Sidebar>
                <PrivateRoute exact path={`/admin/staff`} component={StaffView}/>
                <PrivateRoute exact path={`/admin/registered`} component={RegisterdView}/>
            </SidebarWrapper>
        );
    }
}
AdminView.contextType = Auth0Context

export default AdminView;