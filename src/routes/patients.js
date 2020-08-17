const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const patients = require('../controllers/patients.js');

    // Create new patient
    app.post('/patients', checkJwt, patients.create);

    // Retrieve all patients
    app.get('/patients', checkJwt,  patients.findAll);

    // Retrieve a single patients with patientId
    app.get('/patients/:patientId', checkJwt,  patients.findOne);

    // Retrieve patients using patient index
    app.get('/patients/search/:searchParam', checkJwt,  patients.indexSearch);

    // Retrieve patients assigned to a staff using patient index
    app.get('/patients/assigned/:staffId', checkJwt,  patients.assigned);

    // Update a patients with patientId
    app.put('/patients', checkJwt,  patients.update);

    // Delete a patient with patientId
    app.delete('/patients', checkJwt,  patients.delete);
}