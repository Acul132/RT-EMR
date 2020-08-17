let patients = {
    type: 'object',
    properties: {
        person_id: {type: 'string'},
        health_card_number: { type: 'string'},
        id: {type: 'string'},
        allergy_ids: { 
            type: 'array',
            items: { type: 'string'}
        },
        assigned_doctor_id: { type: 'string'},
        assigned_nurse_id: { type: 'string'},
        assigned_ward_id: {type: 'string'}
        
    },
    required: ['person_id'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = patients;
