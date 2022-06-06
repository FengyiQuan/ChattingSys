const express = require('express');
const router = express.Router();

// main page
router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;
