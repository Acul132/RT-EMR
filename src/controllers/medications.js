const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/medications');
const validateMedications = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateMedications(req.body)
    .then(data => {
        req.app.get('rdb').table('medications').insert(data).run()
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
    req.app.get('rdb').table('medications').run()
    .then(medications => res.send(medications))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('medications').get(req.params.medicationId).run()
    .then(medication => res.send(medication))
    .catch(err => res.status(404).send("Could not find Medication with ID " + req.params.medicationId));
};

exports.indexSearch = async (req,res,next) => {
    req.app.get('medicationIndex').search({ field:"name", query: req.params.searchParam, limit:200})
    .then(results => {
        res.send(results)
    })
    .catch(err => res.status(400).send(err));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Medication cannot be empty");

    validateMedications(req.body)
    .then(data => {
        req.app.get('rdb').table('medications').get(req.params.medicationId).update(data).run()
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

exports.delete = async (req,res,next) => {
    req.app.get('rdb').table('medications').get(req.params.medicationId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};