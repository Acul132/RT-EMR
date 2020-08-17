let admissions = {
    type: 'object',
    properties: {
        patient_id: { type: "string"},
        assigned_nurse_id: { type: "string"},
        assigned_doctor_id: { type: "string"},
        assigned_ward_id: { type: "string"},
        admission_date: {
            type: "string",
            format: "date-time"
        }
    },
    required: ["patient_id", "assigned_ward_id"],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = admissions;
