const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(16)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{7,20}$'))
        .required(),
});

module.exports = schema;
