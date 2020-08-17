const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/persons');
const validatePersons = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validatePersons(req.body)
    .then(data => {
        req.app.get('rdb').table('persons').insert(data).run()
        .then(result => res.send(JSON.stringify(result)))
        .catch(err => res.status(404).send(err));
    })
    .catch(err => {
        if(err.errors)
            res.status(400).send(err.errors);
        else
            res.status(400).send(err);
    });
};

exports.findAll = async (req,res,next) => {
    req.app.get('rdb').table('persons').run()
    .then(persons => res.send(persons))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('persons').get(req.params.personId).run()
    .then(person => res.send(person))
    .catch(err => res.status(404).send("Could not find Person with ID " + req.params.personId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Person cannot be empty");

    validatePersons(req.body)
    .then(data => {
        req.app.get('rdb').table('persons').get(req.body.id).update(data).run()
        .then(result => res.send(JSON.stringify(result)))
        .catch(err => res.status(404).send(err));
    })
    .catch(err => {
        if(err.errors)
            res.status(400).send({error: err.errors});
        else
            res.status(400).send({error: err});
    });
};

exports.delete = async (req,res,next) => {
    req.app.get('rdb').table('persons').get(req.params.personId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};