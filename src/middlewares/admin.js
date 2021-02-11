// const { verifyAdmin } = require('../services/jwtToken');
const jwt = require('jsonwebtoken');
const Response = require('../services/Response');
const jwToken = require('../services/jwtToken');
const { BAD_REQUEST } = require('../services/Constants');
const { Admin, User } = require('../models');
const {
    INACTIVE, ACTIVE
} = require('../services/Constants');

module.exports = {
    adminTokenAuth: async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            Response.errorResponseData(res, res.locals.__('authorizationError'), 401);
        } else {
            const tokenData = await jwToken.decode(token);
            if (tokenData) {
                // eslint-disable-next-line consistent-return
                jwToken.verify(tokenData, (err, decoded) => {
                    if (err) {
                        Response.errorResponseData(res, res.locals.__('invalidToken'), 401);
                    }
                    if (decoded.id) {
                        req.authUserId = decoded.id;
                        // eslint-disable-next-line consistent-return
                        Admin.findById(req.authUserId).then(async (result) => {
                            if (!result) {
                                Response.errorResponseData(res, res.locals.__('invalidToken'), 401);
                            } else {
                                if (result && result.status === INACTIVE) {
                                    Response.errorResponseData(res, res.locals.__('accountIsInactive'), 401);
                                }
                                if (result && result.status === ACTIVE) {
                                    return next();
                                } else {
                                    Response.errorResponseData(res, res.locals.__('accountBlocked'), 401);
                                }
                            }
                        });
                    } else {
                        Response.errorResponseData(res, res.locals.__('invalidToken'), 401);
                    }
                });
            } else {
                Response.errorResponseData(res, res.locals.__('invalidToken'), 401);
            }
        }
    },

    userTokenAuth: async (req, res, next) => {
        const token = req.headers.authorization;
        console.log('token',token)
        if (!token) {
            Response.errorResponseData(res, res.locals.__('authorizationError'), 401);
        } else {
            const tokenData = await jwToken.decode(token);
            if (tokenData) {
                // eslint-disable-next-line consistent-return
                jwToken.verify(tokenData, (err, decoded) => {
                    if (err) {
                        Response.errorResponseData(res, res.locals.__('invalidToken'), 401);
                    }
                    if (decoded.id) {
                        req.authUserId = decoded.id;
                        // eslint-disable-next-line consistent-return
                        User.findById(req.authUserId).then(async (result) => {
                            if (!result) {
                                Response.errorResponseData(res, res.locals.__('invalidToken'), 401);
                            } else {
                                if (result && result.status === INACTIVE) {
                                    Response.errorResponseData(res, res.locals.__('accountIsInactive'), 401);
                                }
                                if (result && result.status === ACTIVE) {
                                    return next();
                                } else {
                                    Response.errorResponseData(res, res.locals.__('accountBlocked'), 401);
                                }
                            }
                        }).catch((err1) => {
                            console.log('Force Update error 1', err1);
                        });
                    } else {
                        Response.errorResponseData(res, res.locals.__('invalidToken'), 401);
                    }
                });
            } else {
                Response.errorResponseData(res, res.locals.__('invalidToken'), 401);
            }
        }
    },
}
