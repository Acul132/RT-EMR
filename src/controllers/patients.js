const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/patients');
const validatePatients = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validatePatients(req.body)
    .then(data => {
        req.app.get('rdb').table('patients').insert(data).run()
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
    let r = req.app.get('rdb');
    r.table('patients').limit(40).merge((patient) => {
        return {person: r.table('persons').get(patient('person_id')).merge((person) =>  {
            return {location: r.table('locations').get(person('location_id'))}
        }), ward: patient.hasFields('assigned_ward_id').branch(r.db('emrsystem').table('wards').get(patient('assigned_ward_id')), false) }
    }).run()
    .then(patients => res.send(patients))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.findOne = async (req,res,next) => {
    let r = req.app.get('rdb')
    r.table('patients').get(req.params.patientId).merge((patient) => {
        return {person: r.table('persons').get(patient('person_id')).merge((person) =>  {
            return {location: r.table('locations').get(person('location_id'))}
        }), }
    }).run()
    .then(patient => res.send(patient))
    .catch(err => res.status(404).send("Could not find Patient with ID " + req.params.patientId));
};

exports.indexSearch = async (req,res,next) => {
    req.app.get('patientIndex').search(req.params.searchParam, {limit: 40})
    .then(results => {
        if(req.query.staff)
            results = results.filter(patient => patient.assigned_doctor_id === req.query.staff || patient.assigned_nurse_id === req.query.staff);
        res.send(results)
    })
    .catch(err => res.status(400).send({error: err}));
};

exports.assigned = async (req,res,next) => {
    res.app.get('patientIndex').search({
        field: ['assigned_doctor_id', 'assigned_nurse_id'],
        bool: 'or',
        query: req.params.staffId
    })
    .then(results => res.send(results))
    .catch(err => res.status(400).send(err))
}

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send({error: "Patient cannot be empty"});

    validatePatients(req.body)
    .then(data => {
        if(req.body.assigned_doctor_id || req.body.assigned_nurse_id || req.body.assigned_ward_id){
            let index = req.app.get('patientIndex').find({"id": req.body.id})
            if(req.body.assigned_doctor_id)
                index.assigned_doctor_id = req.body.assigned_doctor_id
            if(req.body.assigned_nurse_id)
                index.assigned_nurse_id = req.body.assigned_nurse_id
            if(req.body.assigned_ward_id)
                index.assigned_ward_id = req.body.assigned_ward_id
            
            req.app.get('patientIndex').update(index)
        }else{

        }
        data.updatehook = Math.random()
        req.app.get('rdb').table('patients').get(req.body.id).replace(data).run()
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
    req.app.get('rdb').table('patients').get(req.params.patientId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};