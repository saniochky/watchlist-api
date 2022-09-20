const Joi = require('joi');

const schema = Joi.object({
    id: Joi.number()
        .integer()
        .required(),

    liked: Joi.boolean()
        .required(),

    addedDate: Joi.string()
        .required(),
});

module.exports = schema;
