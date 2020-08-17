let consults = {
    type: 'object',
    properties: {
        patient_id: {type: 'string'},
        doctor_id: {type: 'string'},
        consult_type: {type: 'string'},
        consult_date: {
            type: 'string',
            format: 'date-time'
        },
        reason: { type: 'string'}
    },
    required: ['patient_id', 'doctor_id', 'consult_type', 'consult_date'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = consults;
