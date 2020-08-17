let offices = {
    type: 'object',
    properties: {
        location_id: { type: 'string'},
        phone_number: { 
            type: 'string',
            pattern: '^([0-9]{3}-)?[0-9]{3}-[0-9]{4}$'
        },
        fax_number: { 
            type: 'string',
            pattern: '^([0-9]{3}-)?[0-9]{3}-[0-9]{4}$'
        }
    },
    required: ['location_id'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = offices;
