const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/procedures');
const validateProcedures = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateProcedures(req.body)
    .then(data => {
        req.app.get('rdb').table('procedures').insert(data).run()
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
    req.app.get('rdb').table('procedures').run()
    .then(procedures => res.send(procedures))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('procedures').get(req.params.procedureId).run()
    .then(procedure => res.send(procedure))
    .catch(err => res.status(404).send("Could not find Procedure with ID " + req.params.procedureId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Procedure cannot be empty");

    validateProcedures(req.body)
    .then(data => {
        req.app.get('rdb').table('procedures').get(req.params.procedureId).update(data).run()
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
    req.app.get('rdb').table('procedures').get(req.params.procedureId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};