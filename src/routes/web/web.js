const router = require('express').Router();
const formidableMiddleware = require('express-formidable');
const connect = require('connect');
const { userTokenAuth } = require('../../middlewares/admin');

const {  login, signup } =  require("../../controllers/web/UsersController");
const { QuestionList, QuestionAnswerList, addEditQueAns } =  require("../../controllers/web/QuestionController");

const authMiddleware = (function () {
    const chain = connect();
    [formidableMiddleware(), userTokenAuth].forEach((middleware) => {
        chain.use(middleware);
    });
    return chain;
}());

//AUTH
router.post('/login',  login);
router.post('/signup',  signup);

//Quetion
router.get('/question', QuestionList);
router.get('/que-ans', authMiddleware, QuestionAnswerList);
router.post('/que-ans-addedit', formidableMiddleware(), addEditQueAns);

module.exports = router;
