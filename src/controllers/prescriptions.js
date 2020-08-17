const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/prescriptions');
const validatePrescriptions = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validatePrescriptions(req.body)
    .then(data => {
        req.app.get('rdb').table('prescriptions').insert(data).run()
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
    req.app.get('rdb').table('prescriptions').run()
    .then(prescriptions => res.send(prescriptions))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findByPatient = async (req,res,next) => {
    const r = req.app.get('rdb')
    r.table('prescriptions').filter({patient_id: req.params.patientId})
    .orderBy(('administered_date'))
    .eqJoin('medication_id', r.table('medications')).zip()
    .eqJoin('doctor_id', r.table('staff')).zip()
    .eqJoin('person_id', r.table('persons')).without({right: 'active'}).zip()
    .pluck(['first_name', 'last_name', 'name', 'daily_quantity', 'sig', 'administered_date', 'active', 'medication_id', 'strength', 'unit_of_measure'])
    .run()
    .then(prescriptions => res.send(prescriptions))
    .catch(err => res.status(404).send("Could not find Prescription with ID " + req.params.patientId));
};

exports.prescriptionHistory = async (req,res,next) => {
    if(!req.query.medicationId || !req.query.patientId)
        res.status(400).send({error: "Must provide patientId and medicationId"})

    const r = req.app.get('rdb')

    r.table('prescriptions').filter({patient_id: req.query.patientId}).filter({medication_id: req.query.medicationId}).orderBy(('administered_date')).merge((prescription) => {
        return {
            doctor: r.table('staff').get(prescription('doctor_id')).merge((doctor) => {
                return {person: r.table('persons').get(doctor('person_id'))}
            })
        }
    })
    .run()
    .then(prescriptions => res.send(prescriptions))
    .catch(err => res.status(404).send({error: "Could not find prescription history"}));
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('prescriptions').get(req.params.prescriptionId).run()
    .then(prescription => res.send(prescription))
    .catch(err => res.status(404).send("Could not find Prescription with ID " + req.params.prescriptionId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Prescription cannot be empty");

    validatePrescriptions(req.body)
    .then(data => {
        req.app.get('rdb').table('prescriptions').get(req.params.prescriptionId).update(data).run()
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
    req.app.get('rdb').table('prescriptions').get(req.params.prescriptionId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};