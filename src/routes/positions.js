const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const positions = require('../controllers/positions.js');

    // Create new Position
    app.post('/positions', checkJwt, positions.create);

    // Retrieve all Positions
    app.get('/positions', checkJwt,  positions.findAll);

    // Retrieve a single Positions with positionId
    app.get('/positions/:positionId', checkJwt,  positions.findOne);

    // Update a Positions with positionId
    app.put('/positions/:positionId', checkJwt,  positions.update);

    // Delete a Position with positionId
    app.delete('/positions/:positionId', checkJwt,  positions.delete);
}