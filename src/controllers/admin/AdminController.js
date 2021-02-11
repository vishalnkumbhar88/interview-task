const bcrypt = require('bcrypt');
const Transformer = require('object-transformer');
const Response = require('../../services/Response');
const {
    ACTIVE, DELETED
} = require('../../services/Constants');
const { Admin } = require('../../models');
const {
    loginUserValidation
} = require('../../services/AdminValidation');
const { AdminDetails } = require('../../transformers/admin/adminTransformer');
const jwToken = require('../../services/jwtToken');

module.exports = {


    /**
     * @description "This function is use to admin Login."
     * @param req
     * @param res
     */
    login: async (req, res) => {
        const reqParam = req.body;
        loginUserValidation(reqParam, res, (validate) => {
            if (validate) {
                Admin.findOne({
                    email: reqParam.email.toLowerCase(),
                    status: {$ne: DELETED}
                })
                    .then((admin) => {
                        if (admin) {
                            if (admin.status === ACTIVE) {
                                bcrypt.compare(reqParam.password, admin.password, async (err, result) => {
                                    if (err) {
                                        Response.errorResponseData(res, res.locals.__('emailPasswordNotMatch'), null, 400);
                                    }
                                    if (result) {
                                        const adminData = {
                                            id: admin.id,
                                            first_name: admin.first_name,
                                            last_name: admin.last_name,
                                            email: admin.email,
                                            mobile: admin.mobile,
                                            status: admin.status,
                                            admin_detail: null
                                        };
                                        const meta = {token: jwToken.issueAdmin(admin.id)};

                                        Response.successResponseData(res, new Transformer.Single(adminData, AdminDetails).parse(), 1, res.locals.__('loginSuccess'), meta);
                                    } else {
                                        Response.errorResponseData(res, res.locals.__('emailPasswordNotMatch'), 400);
                                    }
                                });
                            } else {
                                Response.errorResponseData(res, res.locals.__('accountIsInactive'), 400);
                            }
                        } else {
                            Response.errorResponseData(res, res.locals.__('emailNotExist'), 400);
                        }
                    });
            }
        });
    },
}