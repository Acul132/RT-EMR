const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const prescriptions = require('../controllers/prescriptions.js');

    // Create new prescription
    app.post('/prescriptions', checkJwt, prescriptions.create);

    // Retrieve all prescriptions
    app.get('/prescriptions', checkJwt,  prescriptions.findAll);

    //Retrive all prescriptions given a patientId
    app.get('/prescriptions/patient/:patientId', checkJwt, prescriptions.findByPatient);

    //Retrive all prescriptions given a patientId
    app.get('/prescriptions/history/', checkJwt, prescriptions.prescriptionHistory);

    // Retrieve a single prescriptions with prescriptionId
    app.get('/prescriptions/:prescriptionId', checkJwt,  prescriptions.findOne);

    // Update a prescriptions with prescriptionId
    app.put('/prescriptions/:prescriptionId', checkJwt,  prescriptions.update);

    // Delete a prescription with prescriptionId
    app.delete('/prescriptions/:prescriptionId', checkJwt,  prescriptions.delete);
}