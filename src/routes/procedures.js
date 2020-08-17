const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const procedures = require('../controllers/procedures.js');

    // Create new procedure
    app.post('/procedures', checkJwt, procedures.create);

    // Retrieve all procedures
    app.get('/procedures', checkJwt,  procedures.findAll);

    // Retrieve a single procedures with procedureId
    app.get('/procedures/:procedureId', checkJwt,  procedures.findOne);

    // Update a procedures with procedureId
    app.put('/procedures/:procedureId', checkJwt,  procedures.update);

    // Delete a procedure with procedureId
    app.delete('/procedures/:procedureId', checkJwt,  procedures.delete);
}