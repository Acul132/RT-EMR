const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const consults = require('../controllers/consults.js');

    // Create new consult
    app.post('/consults', checkJwt, consults.create);

    // Retrieve all consults
    app.get('/consults', checkJwt,  consults.findAll);

    // Retrieve a single consults with consultId
    app.get('/consults/:consultId', checkJwt,  consults.findOne);

    // Update a consults with consultId
    app.put('/consults/:consultId', checkJwt,  consults.update);

    // Delete a consult with consultId
    app.delete('/consults/:consultId', checkJwt,  consults.delete);
}