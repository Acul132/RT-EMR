const checkJwt = require('../check_auth_token');

module.exports = (app) => {
    const persons = require('../controllers/persons.js');

    // Create new Person
    app.post('/persons', checkJwt, persons.create);

    // Retrieve all Persons
    app.get('/persons', checkJwt,  persons.findAll);

    // Retrieve a single Persons with personId
    app.get('/persons/:personId', checkJwt,  persons.findOne);

    // Update a Persons with personId
    app.put('/persons', checkJwt,  persons.update);

    // Delete a Person with personId
    app.delete('/persons', checkJwt,  persons.delete);
}