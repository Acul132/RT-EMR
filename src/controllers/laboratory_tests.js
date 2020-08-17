const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/laboratory_tests');
const validateLaboratoryTests = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateLaboratoryTests(req.body)
    .then(data => {
        req.app.get('rdb').table('laboratory_tests').insert(data).run()
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
    const r = req.app.get('rdb')
    r.table('laboratory_tests').filter(function(test) { return test.hasFields('results').not()})
    .orderBy(r.desc('test_date'))
    .eqJoin('patient_id', r.table('patients')).without({right: "id"}).zip()
    .eqJoin('person_id', r.table('persons')).without({right: "id"}).zip()
    .pluck(['id', 'patient_id', 'first_name', 'last_name', 'test_name', 'test_date', 'results', 'result_date', 'reason'])
    .run()
    .then(laboratory_tests => res.send(laboratory_tests))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findAllPatient = async(req,res,next) => {
    req.app.get('rdb').table('laboratory_tests').filter({patient_id: req.params.patientId}).run()
    .then(laboratory_tests => res.send(laboratory_tests))
    .catch(err => res.status(404).send("Could not find LaboratoryTests with patientID " + req.params.patientId));
}

exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('laboratory_tests').get(req.params.laboratory_testId).run()
    .then(laboratory_test => res.send(laboratory_test))
    .catch(err => res.status(404).send("Could not find LaboratoryTest with ID " + req.params.laboratory_testId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("LaboratoryTest cannot be empty");

    validateLaboratoryTests(req.body)
    .then(data => {
        req.app.get('rdb').table('laboratory_tests').get(req.params.laboratory_testId).update(data).run()
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
    req.app.get('rdb').table('laboratory_tests').get(req.params.laboratory_testId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};