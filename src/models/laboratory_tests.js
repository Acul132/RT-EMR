let laboratory_tests = {
    type: 'object',
    properties: {
        test_name: { type: 'string'},
        reason: { type: 'string'},
        results: { type: 'string'},
        test_date: {
            type: 'string',
            format: 'date-time',
        },
        result_date: {
            type: 'string',
            format: 'date-time',
        },
        patient_id: {type: 'string'},
    },
    required: ['patient_id','test_name','test_date'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = laboratory_tests;
