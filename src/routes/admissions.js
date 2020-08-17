const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const admissions = require('../controllers/admissions.js');

    // Create new admission
    app.post('/admissions', checkJwt, admissions.create);

    // Retrieve all admissions
    app.get('/admissions', checkJwt,  admissions.findAll);

    app.get('/admissions/patient/:patientId', checkJwt,  admissions.findByPatient);

    // Retrieve a single admissions with admissionId
    app.get('/admissions/:admissionId', checkJwt,  admissions.findOne);

    // Update a admissions with admissionId
    app.put('/admissions/:admissionId', checkJwt,  admissions.update);

    // Delete a admission with admissionId
    app.delete('/admissions/:admissionId', checkJwt,  admissions.delete);

    
}