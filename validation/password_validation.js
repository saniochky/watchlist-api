const Joi = require('joi');

const schema = Joi.object({
    oldPassword: Joi.string()
        .alphanum()
        .min(8)
        .max(32)
        .required(),

    newPassword: Joi.string()
        .alphanum()
        .min(8)
        .max(32)
        .invalid(Joi.ref('oldPassword'))
        .required(),
});

module.exports = schema;
