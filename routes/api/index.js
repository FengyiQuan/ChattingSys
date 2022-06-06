const express = require('express');
const router = express.Router();
router.use('/', require('./roomMessage'));
module.exports = router;
