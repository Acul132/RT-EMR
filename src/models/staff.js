let staff = {
    type: 'object',
    properties: {
        person_id: {type: 'string'},
        position_id: {type: 'string'},
        licence_number: {type: 'string'},
        access: {type: "boolean"},
        email: {type: "string"},
        auth0: {type: "string"},
        id: {type: "string"}

    },
    required: ['person_id', 'position_id'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = staff;
