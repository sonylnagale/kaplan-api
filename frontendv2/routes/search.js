const express = require('express');
const config = require('../config');
const request = require('request');

const router = express.Router();

router.get('/:id?', function(req, res, next) {
  if (req.params.id) {
    request({url: config.api_url  + 'search/' + req.params.id, json: true}, function(err, response, json) {
      if (err) {
        throw err;
      }
      res.render('search', { tag: req.params.id, data: json});
    });
  } else {
    res.render('search');
  }
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
