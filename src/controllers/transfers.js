const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/transfers');
const validateTransfers = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateTransfers(req.body)
    .then(data => {
        req.app.get('rdb').table('transfers').insert(data).run()
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

exports.findByPatient = async (req,res,next) => {
    let r = req.app.get('rdb')
    r.table('transfers').filter({patient_id: req.params.patientId}).orderBy('transfer_date').merge((transfer) => {
        return {
            doctor: transfer.hasFields('assigned_doctor_id').branch(r.table('staff').get(transfer('assigned_doctor_id')).merge((doctor) => {
                return {person: r.table('persons').get(doctor('person_id'))}
            }), false),
            nurse: r.table('staff').get(transfer('assigned_nurse_id')).merge((nurse) => {
                return {person: r.table('persons').get(nurse('person_id'))}
            }),
            from_ward: r.table('wards').get(transfer('from_ward_id')),
            to_ward: r.table('wards').get(transfer('to_ward_id'))
        }
    })
    .run()
    .then(transfers => res.send(transfers))
    .catch(err => res.status(404).send(err));

    req.app.get('rdb').table('transfers').run()
};

exports.findAll = async (req,res,next) => {
    req.app.get('rdb').table('transfers').run()
    .then(transfers => res.send(transfers))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('transfers').get(req.params.transferId).run()
    .then(transfer => res.send(transfer))
    .catch(err => res.status(404).send("Could not find Transfer with ID " + req.params.transferId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Transfer cannot be empty");

    validateTransfers(req.body)
    .then(data => {
        req.app.get('rdb').table('transfers').get(req.params.transferId).update(data).run()
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
    req.app.get('rdb').table('transfers').get(req.params.transferId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};