const express = require('express');
const crypto = require('crypto');
const request = require('request');
const config = require('../config');

const router = express.Router();

router.get('/:id?', function(req, res, next) {
  request({url: config.api_url + req.params.id, json: true}, function(err, response, json) {
    if (err) {
      throw err;
    }

    res.render('create', { id: req.params.id, assignment: json});
  });
});

router.post('/', function(req, res, next) {
  request.post({
    url: config.api_url  + 'create',
    form: req.body,
  }, function(error, response, body){
    if (error === null) {
      response.body = response.body.replace(/"/g, '');
      res.redirect('/assignments/' + response.body);
    } else {
      console.error(error);
    }
  });
});

module.exports = router;
