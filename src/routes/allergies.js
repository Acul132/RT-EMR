const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const allergies = require('../controllers/allergies.js');

    // Create new allergy
    app.post('/allergies', checkJwt, allergies.create);

    // Retrieve all allergies
    app.get('/allergies', checkJwt,  allergies.findAll);

    // Retrieve a single allergies with allergyId
    app.get('/allergies/:allergyId', checkJwt,  allergies.findOne);

    // Update a allergies with allergyId
    app.put('/allergies/:allergyId', checkJwt,  allergies.update);

    // Delete a allergy with allergyId
    app.delete('/allergies/:allergyId', checkJwt,  allergies.delete);
}