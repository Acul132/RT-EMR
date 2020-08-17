const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/positions');
const validatePositions = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validatePositions(req.body)
    .then(data => {
        req.app.get('rdb').table('positions').insert(data).run()
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
    req.app.get('rdb').table('positions').run()
    .then(positions => res.send(positions))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('positions').filter({position_name: req.params.positionId}).run()
    .then(position => res.send(position))
    .catch(err => res.status(404).send("Could not find Position with ID " + req.params.positionId));
};



exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Position cannot be empty");

    validatePositions(req.body)
    .then(data => {
        req.app.get('rdb').table('positions').get(req.params.positionId).update(data).run()
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
    req.app.get('rdb').table('positions').get(req.params.positionId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};