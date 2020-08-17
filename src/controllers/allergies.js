const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/allergies');
const validateAllergies = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateAllergies(req.body)
    .then(data => {
        req.app.get('rdb').table('allergies').insert(data).run()
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
    req.app.get('rdb').table('allergies').run()
    .then(allergies => res.send(allergies))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('allergies').get(req.params.allergyId).run()
    .then(allergy => res.send(allergy))
    .catch(err => res.status(404).send("Could not find Allergy with ID " + req.params.allergyId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Allergy cannot be empty");

    validateAllergies(req.body)
    .then(data => {
        req.app.get('rdb').table('allergies').get(req.params.allergyId).update(data).run()
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
    req.app.get('rdb').table('allergies').get(req.params.allergyId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};