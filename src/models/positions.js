let positions = {
    type: 'object',
    properties: {
        position_name: { type: 'string'}
    },
    required: ["position_name"],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = positions;
