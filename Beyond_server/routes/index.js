var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('../configs/jwt-config')

router.get('/', function (req, res, next) {
  console.log('ok');
  return res.json('ok');
});

module.exports = router;
