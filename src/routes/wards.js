const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const wards = require('../controllers/wards.js');

    // Create new ward
    app.post('/wards', checkJwt, wards.create);

    // Retrieve all wards
    app.get('/wards', checkJwt,  wards.findAll);

    // Retrieve a single wards with wardId
    app.get('/wards/:wardId', checkJwt,  wards.findOne);

    //Search index
    app.get('/wards/search/:searchParam', checkJwt, wards.indexSearch);

    // Update a wards with wardId
    app.put('/wards/:wardId', checkJwt,  wards.update);

    // Delete a ward with wardId
    app.delete('/wards/:wardId', checkJwt,  wards.delete);
}