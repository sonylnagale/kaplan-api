const errors = require('restify-errors');
const crypto = require('crypto');
const queryString = require('query-string');
const config = require('../config');
const db = config.db;

module.exports = function(server) {
  server.get('/', (req, res, next) => {
    res.send('Hello world');
  });


  /**
    * @api {post} /assignment/create Create a new Assignment
    * @apiName Post
    * @apiGroup Assignment
    *
    * @apiSuccess {String} assignment The assignment id.
  */
	server.post('/assignment/create', (req, res, next) => {
    let shasum  = crypto.createHash('sha1');
    shasum.update(req.body.name + Date.now());
    let id  = shasum.digest('hex');
    const tags = req.body.tags;
    const assignment = {
      id: id,
      name: req.body.name,
      title: req.body.title,
      tags: [tags],
      description: req.body.description,
    };

    db.ref('assignments').child(id).set(assignment);

    if (tags.length > 0 && tags[0] != '') {
      tags.forEach(function(tag) {
        db.ref('tags').child(tag).push(id);
      });
    }

    res.send(id);
    next();
	});

  /**
    * @api {get} /assignment/ Request All Assignment information
    * @apiName Get
    * @apiGroup Assignment
    *
    * @apiSuccess {Object} assignment All assignments.
  */
	server.get('/assignment', (req, res, next) => {
    db.ref('assignments').once("value").then(function(snapshot) {
      res.send(snapshot.val());
      next();
    }, function (error) {
      console.error(error);
    });
	});

  /**
    * @api {get} /assignment/:id Request Assignment information
    * @apiName Get
    * @apiGroup Assignment
    *
    * @apiParam {String} id Assignment UUID.
    *
    * @apiSuccess {Object} assignment The assignment object.
  */
	server.get('/assignment/:id', (req, res, next) => {
    db.ref('assignments/' + req.params.id).once("value").then(function(snapshot) {
      res.send(snapshot.val());
      next();
    }, function (error) {
      console.error(error);
    });
	});


  /**
    * @api {get} /assignment/search/:id Search assignments
    * @apiName Get
    * @apiGroup Search
    *
    * @apiParam {String} id Assignment UUID.
    *
    * @apiSuccess {Object} assignment The assignment object.
  */

   server.get('/assignment/search/:tag', (req, res, next) => {
      db.ref('tags/' + req.params.tag).once("value").then(function(snapshot) {
        res.send(snapshot.val());
        next();
      }, function (error) {
        console.error(error);
      });
   });

	/**
	 * UPDATE : not implemented
	 */


	/**
	 * DELETE : not implemented
	 */

};
