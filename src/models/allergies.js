let allergies = {
    type: 'object',
    properties: {
        name: { type: "string"},
        symptoms: {
            type: "array",
            items: { type: "string"}
        },
        severity: {
            type: "number",
            minimum: 1,
            maximum: 10,
            default: 1
        }
    },
    required: ["name"],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = allergies;
