const express = require('express');
const config = require('../config');
const request = require('request');

const router = express.Router();

router.get('/', function(req, res, next) {
  request({url: config.api_url, json: true}, function(err, response, json) {
    if (err) {
      throw err;
    }

    res.render('index', { assignments: json});
  });
});

module.exports = router;
