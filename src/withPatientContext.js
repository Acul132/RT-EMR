import React from 'react';
import {PatientContext} from 'PatientContext'
function withPatientContext(Component) {
    return function WrapperComponent(props) {
        return (
            <PatientContext.Consumer>
                {state => <Component {...props} patientContext={state} />}
            </PatientContext.Consumer>
        );
    };
}

export default withPatientContext;