const checkJwt = require('../check_auth_token');
const checkAuth0 = require('../check_auth0');

module.exports = (app) => {
    const staff = require('../controllers/staff.js');

    // Create new staff
    app.post('/staff', checkJwt, staff.create);

    // Retrieve all staff
    app.get('/staff', checkJwt,  staff.findAll);

    app.post('/staff/registration', checkAuth0, staff.registrationHook)

    // Retrieve a single staff with staffId
    app.get('/staff/pending/', checkJwt, staff.pending)
    
    app.get('/staff/:staffId', checkJwt,  staff.findOne);

    app.get('/staff/search/:query', checkJwt, staff.indexSearch);

    // Update a staff with staffId
    app.put('/staff', checkJwt,  staff.update);

    // Delete a staff with staffId
    app.delete('/staff/:staffId', checkJwt,  staff.delete);

    app.post('/staff/login', checkJwt, staff.login);

   
}