const express = require('express');
const config = require('../config');
const request = require('request');

const router = express.Router();

router.get('/', (req,res,next) => {
  res.render('index');
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
      res.json({ message: 'Successfully deleted' })
    } else {
      console.error(error);
    }
  });
});

module.exports = router;
