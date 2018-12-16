const express = require('express');
const config = require('../config');
const request = require('request');

const router = express.Router();

router.get('/:id?', function(req, res, next) {
  request({url: config.api_url + req.params.id, json: true}, function(err, response, json) {
    if (err) {
      throw err;
    }

    res.render('read', { id: req.params.id, assignment: json});
  });
});

module.exports = router;
