let locations = {
    type: 'object',
    properties: {
        address: { type: 'string'},
        city: { type: 'string'},
        province: { type: 'string'},
        country: { type: 'string'},
        postal_code: { type: 'string'},
        location_style: {
            type: 'string',
            default: 'house'
        },
        id: {type: 'string'}
        
    },
    required: ['address','city','province','postal_code'],
    "$schema": "http://json-schema.org/schema#",
    additionalProperties: false,
    "$async": true
};

module.exports = locations;
