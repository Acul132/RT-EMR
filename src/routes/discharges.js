const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const discharges = require('../controllers/discharges.js');

    // Create new discharge
    app.post('/discharges', checkJwt, discharges.create);

    // Retrieve all discharges
    app.get('/discharges', checkJwt,  discharges.findAll);

    app.get('/discharges/patient/:patientId', checkJwt,  discharges.findByPatient);

    // Retrieve a single discharges with dischargeId
    app.get('/discharges/:dischargeId', checkJwt,  discharges.findOne);

    // Update a discharges with dischargeId
    app.put('/discharges/:dischargeId', checkJwt,  discharges.update);

    // Delete a discharge with dischargeId
    app.delete('/discharges/:dischargeId', checkJwt,  discharges.delete);
}