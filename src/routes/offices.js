const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const offices = require('../controllers/offices.js');

    // Create new office
    app.post('/offices', checkJwt, offices.create);

    // Retrieve all offices
    app.get('/offices', checkJwt,  offices.findAll);

    // Retrieve a single offices with officeId
    app.get('/offices/:officeId', checkJwt,  offices.findOne);

    // Update a offices with officeId
    app.put('/offices/:officeId', checkJwt,  offices.update);

    // Delete a office with officeId
    app.delete('/offices/:officeId', checkJwt,  offices.delete);
}