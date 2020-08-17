

const express = require("express");
var cors = require('cors')
var fs = require('fs')
var socketioJwt = require("@ohanapediatrics/socketio-jwt");
const checkJwt = require("./src/check_auth_token");
const flexsearch = require('flexsearch');

// Create a new Express app
const app = express();
var protocol;
if(process.env.NODE_ENV === "production") {
  protocol = require('https').createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/emr.nicolasvenne.ca/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/emr.nicolasvenne.ca/fullchain.pem')
  }, app)
} else {
  protocol = require('http').createServer(app);

} 
const io = require('socket.io')(protocol);
const r = require('rethinkdbdash')({
  db: "emrsystem"
});

const authConfig = {
  domain: "nicolasvenne.auth0.com",
  audience: "https://api.nicolasvenne.ca"
};
app.use(cors())

app.use(express.json());
app.set('rdb', r);

//Attaching Routes
require('./src/routes/persons.js')(app);
require('./src/routes/admissions.js')(app);
require('./src/routes/allergies.js')(app);
require('./src/routes/consults.js')(app);
require('./src/routes/discharges.js')(app);
require('./src/routes/laboratory_tests.js')(app);
require('./src/routes/locations.js')(app);
require('./src/routes/medications.js')(app);
require('./src/routes/offices.js')(app);
require('./src/routes/patients.js')(app);
require('./src/routes/positions.js')(app);
require('./src/routes/prescriptions.js')(app);
require('./src/routes/procedure_types.js')(app);
require('./src/routes/procedures.js')(app);
require('./src/routes/staff.js')(app);
require('./src/routes/transfers.js')(app);
require('./src/routes/wards.js')(app);


//Creating indexes for flexsearch
const patientFields = ["first_name", "last_name", "address","province", "city", "dob", "phone_number", "health_card_number","sex", "postal_code","assigned_ward_id", "assigned_doctor_id", "assigned_nurse_id", 'picture']
const patientIndex = new flexsearch({
  doc: {
    id: "id",
    field: patientFields
  },
  async: true
});

const staffFields = ["first_name", "last_name", 'position_name', 'licence_number']
const staffIndex = new flexsearch({
  doc: {
    id: "id",
    field: staffFields
  },
  async: true
});

const medicationFields = ["name", "manufacturer", "strength", "unit_of_measure", "din"]
const medicationIndex = new flexsearch({
  doc: {
    id: "id",
    field: medicationFields
  },
  async: true
});

const wardFields = ["department_name", "floor", "room", "taken"]
const wardIndex = new flexsearch({
  doc: {
    id: "id",
    field: wardFields
  },
  async: true
});

buildPatientIndex().then(() => {
  app.set('patientIndex', patientIndex);
}).catch(err => console.log(err));

buildStaffIndex().then(() => {
  app.set('staffIndex', staffIndex);
}).catch(err => console.log(err));

buildMedicationIndex().then(() => {
  app.set('medicationIndex', medicationIndex);
}).catch(err => console.log(err));

buildWardIndex().then(() => {
  app.set('wardIndex', wardIndex);
}).catch(err => console.log(err));

io.use(socketioJwt.authorize({
  jwks: `https://${authConfig.domain}/.well-known/jwks.json`,
  handshake: true
}));

io.on('connection', function(client) {
  console.log("user connection");
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });

  client.on("getStaff", (id, cb) => {
    r.table('staff').get(id).merge((staff) => {
        return {person: r.table('persons').get(staff('person_id')).merge((person) =>  {
            return {location: r.table('locations').get(person('location_id'))}
        }), position: r.table('positions').get(staff('position_id')) }
    }).run()
    .then(staff => cb(staff))
    .catch(err => cb({error: err}));
  })

  client.on("getPatient", (id, cb) => {
    r.table('patients').get(id).merge((patient) => {
        return {person: r.table('persons').get(patient('person_id')).merge((person) =>  {
            return {location: r.table('locations').get(person('location_id'))}
        }),  ward: patient.hasFields('assigned_ward_id').branch(r.db('emrsystem').table('wards').get(patient('assigned_ward_id')), false) }
    }).run()
    .then(staff => cb(staff))
    .catch(err => cb({error: err}));
  })

  client.on("getAppointments", (id, cb) => {
    let appointments = {};
    r.table('consults').filter({patient_id: id}).run().then((consults) => {
      appointments.consults = consults;
      r.table('laboratory_tests').filter({patient_id: id}).run().then((tests) => {
        appointments.lab_tests = tests
        r.table('procedures').filter({patient_id: id}).run().then((procedures) => {
          appointments.procedures = procedures;
          cb(appointments);
        })
      })
    })
  })

  client.on("searchStaff", (query, position,  cb = null) => {
    if(!cb) {
      cb = position
      position = null
    }
    staffIndex.search(query
        , position ? {
            where: {
                "position_name": position
            }
        } : {})
    .then(results => {
        cb(results)
    })
    .catch(err => cb(err));
  })
})

r.table('staff').filter({access: false}).changes().run(function(err, cursor) {
  cursor.each((err, val) => {
    if(val.new_val) {
      console.log("emit", val.new_val);
      io.emit("newPendingStaff", val.new_val);
    }
  });
})

r.table('staff').changes().run(function(err, cursor) {
  cursor.each((err, val) => {
    
    if(val.old_val) {
      if(!val.old_val.person) return
      let index = staffIndex.find({id: val.old_val.id})
      r.table('staff').get(val.old_val.id).merge((staff) => {
          return {person: r.table('persons').get(staff('person_id')).merge((person) =>  {
              return {location: r.table('locations').get(person('location_id'))}
          }), position: r.table('positions').get(staff('position_id')) }
      }).run()
      .then(staff => {
        index.first_name = staff.person.first_name;
        index.last_name = staff.person.last_name;
        index.licence_number = staff.licence_number;
        index.position_name = staff.position.position_name;
        staffIndex.update(index);
      })
      
    } else {
      if(!val.new_val.person) return
      let index = {}
      r.table('staff').get(val.new_val.id).merge((staff) => {
          return {person: r.table('persons').get(staff('person_id')).merge((person) =>  {
              return {location: r.table('locations').get(person('location_id'))}
          }), position: r.table('positions').get(staff('position_id')) }
      }).run()
      .then(staff => {
        index.first_name = staff.person.first_name;
        index.last_name = staff.person.last_name;
        index.licence_number = staff.licence_number;
        index.position_name = staff.position.position_name;
        index.id = staff.id
        staffIndex.add(index);
      })
    }
  })
})

r.table('patients').changes().run(function(err, cursor) {
  cursor.each((err, val) => {
    if(val.old_val) {
      let index = patientIndex.find({id: val.old_val.id})
      r.table('patients').get(val.old_val.id).merge((patient) => {
          return {person: r.table('persons').get(patient('person_id')).merge((person) =>  {
              return {location: r.table('locations').get(person('location_id'))}
          }), ward: patient.hasFields('assigned_ward_id').branch(r.db('emrsystem').table('wards').get(patient('assigned_ward_id')), false),
          nurse: patient.hasFields('assigned_nurse_id').branch(r.table('staff').get(patient('assigned_nurse_id')).merge((nurse) => {
              return {person: r.table('persons').get(nurse("person_id"))}
          }), false) }
      }).run()
      .then(patient => {
        index.first_name = patient.person.first_name;
        index.last_name = patient.person.last_name;
        index.sex = patient.person.sex;
        index.dob = patient.person.dob;
        index.address = patient.person.location.address
        index.province = patient.person.location.province
        index.city = patient.person.location.city
        index.postal_code = patient.person.location.postal_code
        index.phone_number = patient.person.phone_number
        index.health_card_number = patient.health_card_number
        index.assigned_ward_id = patient.assigned_ward_id
        index.assigned_doctor_id = patient.assigned_doctor_id
        index.assigned_nurse_id = patient.assigned_nurse_id
        index.picture = patient.person.picture;
        index.id = patient.id
        patientIndex.update(index);
        io.emit("patientUpdate", patient)
      })
      
    } else {
      let index = {}
      r.table('patients').get(val.old_val.id).merge((patient) => {
          return {person: r.table('persons').get(patient('person_id')).merge((person) =>  {
              return {location: r.table('locations').get(person('location_id'))}
          }), ward: patient.hasFields('assigned_ward_id').branch(r.db('emrsystem').table('wards').get(patient('assigned_ward_id')), false),
          nurse: patient.hasFields('assigned_nurse_id').branch(r.table('staff').get(patient('assigned_nurse_id')).merge((nurse) => {
              return {person: r.table('persons').get(nurse("person_id"))}
          }), false) }
      }).run()
      .then(patient => {
        index.first_name = patient.person.first_name;
        index.last_name = patient.person.last_name;
        index.sex = patient.person.sex;
        index.dob = patient.person.dob;
        index.address = patient.person.location.address
        index.province = patient.person.location.province
        index.city = patient.person.location.city
        index.postal_code = patient.person.location.postal_code
        index.phone_number = patient.person.phone_number
        index.health_card_number = patient.health_card_number
        index.assigned_ward_id = patient.assigned_ward_id
        index.assigned_doctor_id = patient.assigned_doctor_id
        index.assigned_nurse_id = patient.assigned_nurse_id
        index.picture = patient.person.picture;
        index.id = patient.id
        patientIndex.add(index);
        io.emit("patientUpdate", patient)

      })
    }
  })
})

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});

// Start the app
protocol.listen(3001, function(){
  console.log('listening on *:3001');
});

async function buildPatientIndex(){
  return new Promise((resolve,reject) => {
    try{
      r.table("patients").eqJoin("person_id", r.table("persons")).without({right: "id"}).zip()
      .eqJoin("location_id", r.table("locations")).without({right: "id"}).zip().pluck(patientFields,"id").run()
      .then(data => {
        for(let i = 0; i < data.length; i++){
          patientIndex.add(data[i])
        }
        resolve();
      })
      .catch(err => reject(err));
    }
    catch(err){
      reject(err);
    }
  });
}

async function buildStaffIndex(){
  return new Promise((resolve,reject) => {
    try{
      r.table("staff").eqJoin("person_id", r.table("persons")).without({right: "id"}).zip()
      .eqJoin("position_id", r.table('positions')).without({right: 'id'}).zip()
      .pluck(staffFields,"id").run()
      .then(data => {
        for(let i = 0; i < data.length; i++){
          staffIndex.add(data[i])
        }
        resolve();
      })
      .catch(err => reject(err));
    }
    catch(err){
      reject(err);
    }
  });
}

async function buildMedicationIndex(){
  return new Promise((resolve,reject) => {
    try{
      r.table("medications").run()
      .then(data => {
        for(let i = 0; i < data.length; i++){
          medicationIndex.add(data[i])
        }
        resolve();
      })
      .catch(err => reject(err));
    }
    catch(err){
      reject(err);
    }
  });
}

async function buildWardIndex(){
  return new Promise((resolve,reject) => {
    try{
      r.table("wards").run()
      .then(data => {
        for(let i = 0; i < data.length; i++){
          wardIndex.add(data[i])
        }
        resolve();
      })
      .catch(err => reject(err));
    }
    catch(err){
      reject(err);
    }
  });
}