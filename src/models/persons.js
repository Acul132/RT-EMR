let persons = {
    type: 'object',
    properties: {
        dob: {
            type: 'string',
            format: 'date-time'
        },
        first_name: {type: 'string'},
        last_name: { type: 'string'},
        location_id: { type: 'string'},
        phone_number: {
            type: 'string'
            /*pattern: '^([0-9]{3}-)?[0-9]{3}-[0-9]{4}$'*/
        },
        sex: { type: 'string'},
        active: {
             type: 'boolean',
             default: true
        },
        id: {type: 'string'}
    },
    required: ['dob','first_name','last_name'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = persons;
