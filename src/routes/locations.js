const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const locations = require('../controllers/locations.js');

    // Create new location
    app.post('/locations', checkJwt, locations.create);

    // Retrieve all locations
    app.get('/locations', checkJwt,  locations.findAll);

    // Retrieve a single locations with locationId
    app.get('/locations/:locationId', checkJwt,  locations.findOne);

    // Update a locations with locationId
    app.put('/locations', checkJwt,  locations.update);

    // Delete a location with locationId
    app.delete('/locations', checkJwt,  locations.delete);
}