let medications = {
    type: 'object',
    properties: {
        name: { type: 'string'},
        manufacturer: { type: 'string'},
        strength: { type: 'number'},
        unit_of_measure: { 
            type: 'string',
            default: 'mg'
        },
        din: { type: 'string' }
    },
    required: ['din','manufacturer'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = medications;
