const router = require('express').Router();
const adminRoute = require('./admin/admin');
const webRoute = require('./web/web');

// Admin router
router.use('/admin', adminRoute);

// Web router
router.use('/', webRoute);
module.exports = router;
