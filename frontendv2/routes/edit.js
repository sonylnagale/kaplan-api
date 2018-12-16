const express = require('express');
const config = require('../config');
const request = require('request');

const router = express.Router();

router.get('/', (req,res,next) => {
  res.render('index');
});

router.put('/', function(req, res, next) {
  request.put({
    url: config.api_url  + 'update',
    form: req.body,
  }, function(error, response, body){
    if (error === null) {
      response.body = response.body.replace(/"/g, '');
    } else {
      console.error(error);
    }
  });
});

router.put('/', (req, res, next) => {
  console.log('put');
});


router.delete('/', (req, res, next) => {
  request.del({
    url: config.api_url  + "delete",
    form: req.body,
  }, function(error, response, body){
    if (error === null) {
    } else {
      console.error(error);
    }
  });
});

module.exports = router;
