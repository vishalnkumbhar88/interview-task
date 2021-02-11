const Joi = require('@hapi/joi');
const Response = require('./Response');
const Helper = require('./Helper');
const Constants = require('../services/Constants');

module.exports = {
    loginUserValidation: (req, res, callback) => {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8)
        });
        const { error } = schema.validate(req);
        if (error) {
            return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey('login', error)));
        }
        return callback(true);
    },


};

