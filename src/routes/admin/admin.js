const router = require('express').Router();
const formidableMiddleware = require('express-formidable');
const connect = require('connect');
const { adminTokenAuth } = require('../../middlewares/admin');
const { login } = require('../../controllers/admin/AdminController');
const { userList, deleteUser, QuetionList } = require('../../controllers/admin/UserController');


const authMiddleware = (function () {
    const chain = connect();
    [formidableMiddleware(), adminTokenAuth].forEach((middleware) => {
        chain.use(middleware);
    });
    return chain;
}());

// // admin
router.post('/login',  login);
router.get('/user-list', authMiddleware, userList);
router.delete('/user-delete/:id', authMiddleware, deleteUser);
router.get('/que-ans-list', authMiddleware, QuetionList);

module.exports = router;
