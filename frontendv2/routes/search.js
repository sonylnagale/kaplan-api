const express = require('express');
const config = require('../config');
const request = require('request');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('search');
});

router.post('/', function(req, res, next) {
  request({url: config.api_url  + 'search/' + req.body.search, json: true}, function(err, response, json) {
    if (err) {
      throw err;
    }
    res.render('search', { tag: req.body.search, data: json});
  });
});

module.exports = router;
