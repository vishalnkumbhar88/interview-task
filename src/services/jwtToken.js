const jwt = require('jsonwebtoken');
const tokenSecretAdmin = ("express-mysql-demo" + 'Admin-0123456789');

// Generates an admin token
module.exports.issueAdmin = function (payload) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
        id: payload
    }, tokenSecretAdmin, {algorithm: 'HS512'});
};

// Verifies admin token
module.exports.verify = function (token, callback) {
    try {
        return jwt.verify(token, tokenSecretAdmin, {}, callback);
    } catch (err) {
        return "error";
    }
};


// Decode token on a request and get without bearer
module.exports.decode = async (token) => {
    const parts = token.split(' ');
    if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
            return credentials;
        }
        return false;
    }
    return false;
};
