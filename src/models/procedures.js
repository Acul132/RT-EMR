let procedures = {
    type: 'object',
    properties: {
        patient_id: {type: 'string'},
        doctor_id: {type: 'string'},
        procedure_type: {type: 'string'},
        procedure_date: {
            type: 'string',
            format: 'date-time'
        },
        reason: { type: 'string'}
    },
    required: ['patient_id', 'doctor_id', 'procedure_type', 'procedure_date'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = procedures;
