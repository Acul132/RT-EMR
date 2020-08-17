let procedures_types = {
    type: 'object',
    properties: {
        name: { type: 'string'},
        description: { type: 'string'}
    },
    required: ['name'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = procedures_types;
