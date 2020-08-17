const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const medications = require('../controllers/medications.js');

    // Create new medication
    app.post('/medications', checkJwt, medications.create);

    // Retrieve all medications
    app.get('/medications', checkJwt,  medications.findAll);

    // Search medication index
    app.get('/medications/search/:searchParam', checkJwt, medications.indexSearch)

    // Retrieve a single medications with medicationId
    app.get('/medications/:medicationId', checkJwt,  medications.findOne);

    // Update a medications with medicationId
    app.put('/medications/:medicationId', checkJwt,  medications.update);

    // Delete a medication with medicationId
    app.delete('/medications/:medicationId', checkJwt,  medications.delete);
}