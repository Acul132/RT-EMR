const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/locations');
const validateLocations = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateLocations(req.body)
    .then(data => {
        req.app.get('rdb').table('locations').insert(data).run()
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
    req.app.get('rdb').table('locations').run()
    .then(locations => res.send(locations))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('locations').get(req.params.locationId).run()
    .then(location => res.send(location))
    .catch(err => res.status(404).send("Could not find Location with ID " + req.params.locationId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Location cannot be empty");

    validateLocations(req.body)
    .then(data => {
        req.app.get('rdb').table('locations').get(req.body.id).update(data).run()
        .then(result => res.send(JSON.stringify(result)))
        .catch(err => res.status(404).send({error: err}));
    })
    .catch(err => {
        if(err.errors)
            res.send({error: err.errors});
        else
            res.send({error: err});
    });
};

exports.delete = async (req,res,next) => {
    req.app.get('rdb').table('locations').get(req.params.locationId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};