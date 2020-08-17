const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const laboratory_tests = require('../controllers/laboratory_tests.js');

    // Create new laboratory_test
    app.post('/laboratory_tests', checkJwt, laboratory_tests.create);

    // Retrieve all laboratory_tests
    app.get('/laboratory_tests', checkJwt,  laboratory_tests.findAll);

    //Retrive all laboratory_tests for a given patientId
    app.get('/laboratory_tests/patient/:patientId', checkJwt, laboratory_tests.findAllPatient);

    // Retrieve a single laboratory_tests with laboratory_testId
    app.get('/laboratory_tests/:laboratory_testId', checkJwt,  laboratory_tests.findOne);

    // Update a laboratory_tests with laboratory_testId
    app.put('/laboratory_tests/:laboratory_testId', checkJwt,  laboratory_tests.update);

    // Delete a laboratory_test with laboratory_testId
    app.delete('/laboratory_tests/:laboratory_testId', checkJwt,  laboratory_tests.delete);
}