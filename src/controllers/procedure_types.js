const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/procedure_types');
const validateProcedureTypes = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateProcedureTypes(req.body)
    .then(data => {
        req.app.get('rdb').table('procedure_types').insert(data).run()
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
    req.app.get('rdb').table('procedure_types').run()
    .then(procedure_types => res.send(procedure_types))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('procedure_types').get(req.params.procedure_typeId).run()
    .then(procedure_type => res.send(procedure_type))
    .catch(err => res.status(404).send("Could not find ProcedureType with ID " + req.params.procedure_typeId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("ProcedureType cannot be empty");

    validateProcedureTypes(req.body)
    .then(data => {
        req.app.get('rdb').table('procedure_types').get(req.params.procedure_typeId).update(data).run()
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
    req.app.get('rdb').table('procedure_types').get(req.params.procedure_typeId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};