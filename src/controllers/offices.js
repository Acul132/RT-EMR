const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/offices');
const validateOffices = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateOffices(req.body)
    .then(data => {
        req.app.get('rdb').table('offices').insert(data).run()
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
    req.app.get('rdb').table('offices').run()
    .then(offices => res.send(offices))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('offices').get(req.params.officeId).run()
    .then(office => res.send(office))
    .catch(err => res.status(404).send("Could not find Office with ID " + req.params.officeId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Office cannot be empty");

    validateOffices(req.body)
    .then(data => {
        req.app.get('rdb').table('offices').get(req.params.officeId).update(data).run()
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
    req.app.get('rdb').table('offices').get(req.params.officeId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};