let wards = {
    type: 'object',
    properties: {
        department_name: { type: 'string'},
        floor: { type: 'string'},
        room: { type: 'string' }
    },
    required: ['department_name', 'floor', 'room'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = wards;
