const bcrypt = require('bcrypt');
const Response = require('../../services/Response');
const Helper = require('../../services/Helper');
const Transformer = require('object-transformer');
const { login } = require("../../transformers/web/UserTransformer");
const { User } = require('../../models');
const { ACTIVE, INTERNAL_SERVER, SUCCESS, FAIL, BAD_REQUEST } = require('../../services/Constants');
const {
    userRegistrationValidation,
    loginValidation
} = require("../../services/WebValidation");
const { issueAdmin } = require("../../services/jwtToken");



module.exports ={
    /**
     * @description "This function is use user Login."
     * @param req
     * @param res
     */

    login: async (req, res) => {
        const reqParam = req.body;
        loginValidation(reqParam, res, (validate) => {
            if (validate) {
                User.findOne({
                    email: reqParam.email.toLowerCase().trim(),
                    status: ACTIVE
                }).then(async (user) => {
                    if (user) {
                        // if (user.is_verify === VERIFIED) {
                        if (user.status === ACTIVE) {
                            bcrypt.compare(reqParam.password, user.password, async (err, result) => {
                                if (err) {
                                    Response.errorResponseData(res, res.locals.__('Entered email address or password  is not registered with us.'), null, BAD_REQUEST);
                                }
                                if (result) {
                                    const meta = { token: issueAdmin(user.id) };
                                    Response.successResponseData(res, new Transformer.Single(user, login).parse(), SUCCESS, res.locals.__('loginSuccess'), meta);
                                }
                                else {
                                    Response.successResponseData(res, null, FAIL, res.locals.__('emailPasswordNotMatch'));
                                }
                            });
                        }
                        else {
                            Response.successResponseData(res, null, FAIL, res.locals.__('accountIsInactive'));
                        }
                        //   }
                    }
                    else {
                        Response.successResponseData(res, null, FAIL, res.locals.__('emailNotExist'));
                    }
                    // eslint-disable-next-line no-unused-vars
                }, (err) => {
                    Response.errorResponseData(res, res.__('internalError'), INTERNAL_SERVER);
                });
            }
        });
    },

    /**
     * @description "This function is use to user signup."
     * @param req
     * @param res
     */

    signup: async (req, res) => {
        const requestParams = req.body;

        userRegistrationValidation(requestParams, res, async (validate) => {
            if (validate) {

                const hash = bcrypt.hashSync(requestParams.password.trim(), 10);
                const resetPasswordCode = await Helper.makeRandomNumber(7);

                const user = {
                    first_name: requestParams.first_name,
                    last_name: requestParams.last_name,
                    email: requestParams.email,
                    mobile: requestParams.mobile,
                    password: hash,
                    status: ACTIVE
                };
               const link = `${process.env.APP_URL}/verify-email?email=${requestParams.email.trim()}&verification_link=${resetPasswordCode}`;
                User.findOne({
                    email: {
                        $regex: `^${requestParams.email}$`,
                        $options: 'i'
                    }
                }).then(async (userResult) => {
                    if (!userResult) {
                        User.create(user).then(async (result) => {
                            if (result) {
                                Response.successResponseWithoutData(res, res.__('userRegisteredSuccessFully'), SUCCESS);
                            }
                            else {
                                Response.errorResponseData(res, res.__('somethingWentWrong'), INTERNAL_SERVER);
                            }
                        });
                    }
                    else {
                        Response.successResponseWithoutData(res, res.__('emailAlreadyRegisteredWithUs'), BAD_REQUEST);
                    }
                }, () => {
                    Response.errorResponseData(res, res.__('InternalServerError'), INTERNAL_SERVER);
                });
            }
        });
    },
}

