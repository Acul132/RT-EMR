
import io from 'socket.io-client';


export default class api {
    constructor(client, token) {
        this._client = client;
        this._url = (process.env.NODE_ENV === "production") ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL_DEV
        this._socket =  io(this._url, {
            query: {
              token: token
            }
          });
 
    }

    async emit(name, ...args) {
        return new Promise((resolve, reject) => {
            this._socket.emit(name, ...args, (data) => {
                resolve(data)
            })
        })
    }

    async patients(id) {

        return this._getSearchPatients(id)

    }

    staffService() {
        return {
            search: async (query) => {return this.emit("searchStaff", query)},
            get: async (id = null) => {return this.emit("getStaff", id)},
            subscribe: async (cb) => {return this._socket.on("newStaff", cb)},
            subscribePending: async (cb) => {return this._socket.on("newPendingStaff", cb)},
            
        }
    }

    patientService() {
        return {
            get: async (id) => {return this.emit("getPatient", id)},
            appointments: async (id) => {return this.emit("getAppointments", id)},
            subscribe: (cb) => {return this._socket.on("patientUpdate", cb)}
        }
    }


    //**REGION LAB REPORTS**
    async getPatientLabReports(id) {
        const token = await this._client.getTokenSilently();
        const result = await fetch(`${this._url}/laboratory_tests/patient/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return result.json()
    }

    async getPendingStaff() {
        try {
            const token = await this._client.getTokenSilently();
            const result = await fetch(`${this._url}/staff/pending`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return result.json()
        } catch(error) {
            console.log(error)
        }
        
        
        
    }

    async form(endpoint, method, data) {
        const token = await this._client.getTokenSilently(); 
        let result;
        if(method == "GET") {
            result = await fetch(`${this._url}/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        } else {
            result = await fetch(`${this._url}/${endpoint}`, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        }
        
        return result.json();
    }
    async updateLabResults(data) {
        console.log('data', data)
        const token = await this._client.getTokenSilently();
        const result = await fetch(`${this._url}/laboratory_tests/${data.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(data)
        });
        console.log("Success");
    }
        
    async deleteProcedure(procedureId){
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/procedures/${procedureId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
        });
    }

    async deleteLabTest(laboratory_testId){
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/laboratory_tests/${laboratory_testId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
        });
    }

    async deleteConsult(consultId){
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/consults/${consultId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
        });
    }

    async patient(id) {
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/patients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return result.json();
    }

    async prescriptions(patientId) {
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/prescriptions/patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return result.json();
    }

    async admissions(patientId) {
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/admissions/patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return result.json();
    }

    async transfers(patientId) {
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/transfers/patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return result.json();
    }

    async discharges(patientId) {
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/discharges/patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return result.json();
    }

    async newPrescription(prescriptionInfo){
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/prescriptions`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(prescriptionInfo)
        });
    }

    async admitPatient(patientInfo){
        const token = await this._client.getTokenSilently(); 
        await fetch(`${this._url}/patients`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(patientInfo)
        });

        patientInfo.patient_id = patientInfo.id
        delete patientInfo.id
        await fetch(`${this._url}/admissions`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(patientInfo)
        });
    }

    async transferPatient(patientInfo){
        let updatedPatient = {
            id: patientInfo.id,
            person_id: patientInfo.person_id,
            health_card_number: patientInfo.health_card_number,
            assigned_nurse_id: patientInfo.assigned_nurse_id,
            assigned_ward_id: patientInfo.to_ward_id
        }
        if(patientInfo.assigned_doctor_id)
            updatedPatient.assigned_doctor_id = patientInfo.assigned_doctor_id

        const token = await this._client.getTokenSilently(); 
        await fetch(`${this._url}/patients`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(updatedPatient)
        });

        patientInfo.patient_id = patientInfo.id
        delete patientInfo.id
        await fetch(`${this._url}/transfers`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(patientInfo)
        });
    }

    async dischargePatient(patientInfo){
        const updatedPatient = {
            id: patientInfo.id,
            person_id: patientInfo.person_id,
            health_card_number: patientInfo.health_card_number
        }

        console.log(updatedPatient)
        const token = await this._client.getTokenSilently(); 
        await fetch(`${this._url}/patients`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(updatedPatient)
        });

        patientInfo.patient_id = patientInfo.id
        delete patientInfo.id
        console.log(patientInfo)
        await fetch(`${this._url}/discharges`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(patientInfo)
        });
    }

    async getLabTest(laboratory_testId) {
        const token = await this._client.getTokenSilently(); 
        //TODO: Change to loaded employee

        const result = await fetch(`${this._url}/laboratory_tests/${laboratory_testId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(result.body)
            return result.json()
        else
            return []
    }

    async getAllLabTests() {
        const token = await this._client.getTokenSilently(); 
        //TODO: Change to loaded employee

        const result = await fetch(`${this._url}/laboratory_tests`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return result.json();
    }

    async createLabTest(labtest){
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/laboratory_tests`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(labtest)
        });
    }
    //**END REGION LAB REPORTS**

    async createProcedure(procedure){
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/procedures`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(procedure)
        });
    }

    async createConsult(consult){
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/consults`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(consult)
        });
    }

    async searchMedications(query) {
        const token = await this._client.getTokenSilently(); 

        if(query !== ''){
            const result = await fetch(`${this._url}/medications/search/${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return result.json();
        }
        else{
            return [];
        }
    }

    async prescriptionHistory(patientId, medicationId) {
        const token = await this._client.getTokenSilently(); 

        if(patientId !== '' && medicationId !== ''){
            const result = await fetch(`${this._url}/prescriptions/history?patientId=${patientId}&medicationId=${medicationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return result.json();
        }
        else{
            return [];
        }
    }

    async updatePrescription(prescription) {
        const token = await this._client.getTokenSilently(); 
        const result = await fetch(`${this._url}/prescriptions/${prescription.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(prescription)
        });
        return result.json();
    }

    async medicationInfo(medicationId) {
        const token = await this._client.getTokenSilently(); 
        if(medicationId !== ''){
            const result = await fetch(`${this._url}/medications/${medicationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return result.json();
        }
        else{
            return {};
        }
    }

    async searchWard(query) {
        const token = await this._client.getTokenSilently(); 

        if(query !== ''){
            const result = await fetch(`${this._url}/wards/search/${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return result.json();
        }
        else{
            return [];
        }
    }

    async searchPatients(query, id) {
        const token = await this._client.getTokenSilently(); 
        //TODO: Change to loaded employee

        const result = await fetch(`${this._url}/patients/search/${query}${id ? `?staff=${id}` : ""}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return result.json();
    }

    async searchStaff(query, position = null) {
        if(query === "") return [];
        const token = await this._client.getTokenSilently(); 
        //TODO: Change to loaded employee

        const result = await fetch(`${this._url}/staff/search/${query}${position ? `?position=${position}` : ""}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return result.json();
    }

    async _getSearchPatients(id) {
        const token = await this._client.getTokenSilently(); 
        //TODO: Change to loaded employee
        const result = await fetch(`${this._url}/patients/${id ? `assigned/${id}` : ""}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return result.json();
      
        
    }


}