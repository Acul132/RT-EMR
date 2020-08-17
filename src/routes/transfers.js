const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const transfers = require('../controllers/transfers.js');

    // Create new transfer
    app.post('/transfers', checkJwt, transfers.create);

    // Retrieve all transfers
    app.get('/transfers', checkJwt,  transfers.findAll);

    app.get('/transfers/patient/:patientId', checkJwt,  transfers.findByPatient);

    // Retrieve a single transfers with transferId
    app.get('/transfers/:transferId', checkJwt,  transfers.findOne);

    // Update a transfers with transferId
    app.put('/transfers/:transferId', checkJwt,  transfers.update);

    // Delete a transfer with transferId
    app.delete('/transfers/:transferId', checkJwt,  transfers.delete);
}