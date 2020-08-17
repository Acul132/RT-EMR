const ajv = require('ajv')({
    removeAdditional: true,
    useDefaults: true
});
const schema = require('../models/staff');
const validateStaff = ajv.compile(schema);

exports.create = async (req,res,next) => {
    validateStaff(req.body)
    .then(data => {
        req.app.get('rdb').table('staff').insert(data).run()
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
    req.app.get('rdb').table('staff').run()
    .then(staff => res.send(staff))
    .catch(err => {res.statusCode = 404; throw Error(err)});
};

exports.indexSearch = async (req,res,next) => {
    req.app.get('staffIndex').search(req.params.query
        , req.query.position ? {
            where: {
                "position_name": req.query.position
            }
        } : {})
    .then(results => {
        res.send(results)
    })
    .catch(err => res.status(400).send(err));
};

exports.registrationHook = async (req, res, next) => {
    req.app.get('rdb').table('staff').insert({auth0: req.body.id, email: req.body.email, access: false}).run().then(() => {
        res.status(200).send()
    }).catch((e) => {
        res.status(500).send({error: e})
    })
}
exports.findOne = async (req,res,next) => {
    req.app.get('rdb').table('staff').get(req.params.staffId).run()
    .then(staff => res.send(staff))
    .catch(err => res.status(404).send("Could not find Staff with ID " + req.params.staffId));
};

exports.update = async (req,res,next) => {
    if(!req.body)
        res.status(400).send("Staff cannot be empty");

    validateStaff(req.body)
    .then(data => {
        data.updatehook = Math.random();
        req.app.get('rdb').table('staff').get(req.body.id).update(data).run()
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
    req.app.get('rdb').table('staff').get(req.params.staffId).delete().run()
    .then(result => res.send(JSON.stringify(result)))
    .catch(err => res.status(404).send(err));
};

exports.login = async (req, res, next) => {
    let r = req.app.get('rdb')
    r.table('staff').filter({auth0: req.body.id}).merge((staff) => {
        return {
            position: staff.hasFields('position_id').branch(r.table('positions').get(staff('position_id')), false), 
            person: staff.hasFields('person_id').branch(r.table('persons').get(staff('person_id')), false)
        };
    }).run().then(result => res.send(JSON.stringify(result[0])))
    .catch(err => res.status(404).send({error: err}));
}

exports.pending = async (req, res, next) => {
    let r = req.app.get('rdb')
    r.table('staff').filter({access: false}).run().then((result) => {
        console.log(result)
        res.send(result)
    }).catch((e) => {
        console.log(e)
        res.status(404).send({error: e})
    })
}