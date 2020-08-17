const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const procedure_types = require('../controllers/procedure_types.js');

    // Create new procedure_type
    app.post('/procedure_types', checkJwt, procedure_types.create);

    // Retrieve all procedure_types
    app.get('/procedure_types', checkJwt,  procedure_types.findAll);

    // Retrieve a single procedure_types with procedure_typeId
    app.get('/procedure_types/:procedure_typeId', checkJwt,  procedure_types.findOne);

    // Update a procedure_types with procedure_typeId
    app.put('/procedure_types/:procedure_typeId', checkJwt,  procedure_types.update);

    // Delete a procedure_type with procedure_typeId
    app.delete('/procedure_types/:procedure_typeId', checkJwt,  procedure_types.delete);
}