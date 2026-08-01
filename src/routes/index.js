const express = require('express');
const router = express.Router();

router.use('/alerts', require('./alertRoutes'));
router.use('/medicines', require('./medicineRoutes'));
router.use('/orders', require('./orderRoutes'));

module.exports = router;
