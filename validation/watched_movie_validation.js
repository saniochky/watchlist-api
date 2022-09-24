const Joi = require('joi');

const schema = Joi.object({
    id: Joi.number()
        .integer()
        .required(),

    liked: Joi.boolean(),

    addedDate: Joi.string(),
});

module.exports = schema;
