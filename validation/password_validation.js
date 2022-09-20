const Joi = require('joi');

const schema = Joi.object({
    oldPassword: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{7,20}$'))
        .required(),

    newPassword: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{7,20}$'))
        .invalid(Joi.ref('oldPassword'))
        .required(),
});

module.exports = schema;
