const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/wards');
const validateWards = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateWards(req.body)
    .then(data => {
        req.app.get('rdb').table('wards').insert(data).run()
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
    req.app.get('rdb').table('wards').run()
    .then(wards => res.send(wards))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('wards').get(req.params.wardId).run()
    .then(ward => res.send(ward))
    .catch(err => res.status(404).send("Could not find Ward with ID " + req.params.wardId));
};

exports.indexSearch = async (req,res,next) => {
    req.app.get('wardIndex').search(req.params.searchParam
        ,{
            field: ['department_name', "floor", "room"],
            where: {
                "taken": false
            }
        })
    .then(results => {
        res.send(results)
    })
    .catch(err => res.status(400).send(err));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Ward cannot be empty");

    validateWards(req.body)
    .then(data => {
        req.app.get('rdb').table('wards').get(req.params.wardId).update(data).run()
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
    req.app.get('rdb').table('wards').get(req.params.wardId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};