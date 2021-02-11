const Joi = require('@hapi/joi');
const Response = require('./Response');
const Helper = require('./Helper');

module.exports = {

    userRegistrationValidation: (req, res, callback) => {
        const requestObj = {
            first_name: Joi.string()
                .required().max(60)
                .trim(),
            last_name: Joi.string()
                .required().max(60)
                .trim(),
            email: Joi.string()
                .required().max(120).email(),
            password: Joi.string().required().min(6).regex(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{6,}$/)
                .trim(),
        };
        if (req.email && req.email !== '') {
            requestObj.email = Joi.string().email().max(200).required();
        }
        const schema = Joi.object(requestObj);
        const { error } = schema.validate(req);
        if (error) {
            return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey('user', error)));
        }
        return callback(true);
    },
    loginValidation: (req, res, callback) => {
        const schema = Joi.object({
            email: Joi.string().email().max(150).required(),
            password: Joi.string().required().min(6),
        });
        const { error } = schema.validate(req);
        if (error) {
            Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey('loginValidation', error)));
        }
        return callback(true);
    },

    QueAnsAddEditValidation: (req, res, callback) => {
        const schema = Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
            user_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            question: Joi.string().trim().optional(),
            answer: Joi.string().trim().optional(),

        });
        const { error } = schema.validate(req);
        if (error) {
            Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey('AddEditValidation', error)));
        }
        return callback(true);
    }
}

