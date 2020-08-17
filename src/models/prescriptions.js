let prescriptions = {
    type: 'object',
    properties: {
        patient_id: {type: 'string'},
        doctor_id: {type: 'string'},
        medication_id: {type: 'string'},
        daily_quantity: {type: 'number', minimum: 0},
        sig: {type: 'string'},
        active: {type: 'boolean', default: true},
        administered_date: {type: 'string', format: 'date-time'},
        end_date: {type: 'string', format: 'date-time'}
    },
    required: ['patient_id', 'medication_id'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = prescriptions;
