const express = require('express');
const crypto = require('crypto');
const request = require('request');
const config = require('../config');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('create', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
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
