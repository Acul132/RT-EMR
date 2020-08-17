const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/consults');
const validateConsults = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateConsults(req.body)
    .then(data => {
        req.app.get('rdb').table('consults').insert(data).run()
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
    req.app.get('rdb').table('consults').run()
    .then(consults => res.send(consults))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('consults').get(req.params.consultId).run()
    .then(consult => res.send(consult))
    .catch(err => res.status(404).send("Could not find Consult with ID " + req.params.consultId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Consult cannot be empty");

    validateConsults(req.body)
    .then(data => {
        req.app.get('rdb').table('consults').get(req.params.consultId).update(data).run()
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
    req.app.get('rdb').table('consults').get(req.params.consultId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};