const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(4)
        .max(16)
        .required(),

    password: Joi.string()
        .alphanum()
        .required()
        .min(8)
        .max(32),
});

module.exports = schema;
