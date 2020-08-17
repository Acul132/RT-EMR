const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/admissions');
const validateAdmissions = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateAdmissions(req.body)
    .then(data => {
        req.app.get('rdb').table('admissions').insert(data).run()
        .then(result => res.send(JSON.stringify(result)))
        .catch(err => res.status(404).send(err));
    })
    .catch(err => {
        if(err.errors)
            res.status(400).send(err);
        else
            res.status(400).send(err);
    });
};

exports.findAll = async (req,res,next) => {
    req.app.get('rdb').table('admissions').run()
    .then(admissions => res.send(admissions))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findByPatient = async (req,res,next) => {
    let r = req.app.get('rdb')
    r.table('admissions').filter({patient_id: req.params.patientId}).orderBy('admission_date').merge((admission) => {
        return {
            doctor: admission.hasFields('assigned_doctor_id').branch(r.table('staff').get(admission('assigned_doctor_id')).merge((doctor) => {
                return {person: r.table('persons').get(doctor('person_id'))}
            }), false),
            nurse: r.table('staff').get(admission('assigned_nurse_id')).merge((nurse) => {
                return {person: r.table('persons').get(nurse('person_id'))}
            }),
            ward: r.table('wards').get(admission('assigned_ward_id'))
        }
    })
    .run()
    .then(admissions => res.send(admissions))
    .catch(err => res.status(404).send(err));

    req.app.get('rdb').table('admissions').run()
};

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('admissions').get(req.params.admissionId).run()
    .then(admission => res.send(admission))
    .catch(err => res.status(404).send("Could not find Admission with ID " + req.params.admissionId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Admission cannot be empty");

    validateAdmissions(req.body)
    .then(data => {
        req.app.get('rdb').table('admissions').get(req.params.admissionId).update(data).run()
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
    req.app.get('rdb').table('admissions').get(req.params.admissionId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};