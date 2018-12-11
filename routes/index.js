const errors = require('restify-errors');
const crypto = require('crypto');
const queryString = require('query-string');
const config = require('../config');
const db = config.db;

module.exports = function(server) {

  /**
	 * CREATE
	 */
	server.post('/assignments/create', (req, res, next) => {
    console.log(req.body);
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
	});

  /**
    * @api {get} /assignments/ Request All Assignment information
    * @apiName Get
    * @apiGroup Assignment
    *
    * @apiSuccess {Object} assignment All assignments.
  */
	server.get('/assignments', (req, res, next) => {
    db.ref('assignments').once("value").then(function(snapshot) {
      res.send(snapshot.val());
      next();
    }, function (error) {
      console.error(error);
    });
	});

  /**
    * @api {get} /assignments/:id Request Assignment information
    * @apiName Get
    * @apiGroup Assignment
    *
    * @apiParam {String} id Assignment UUID.
    *
    * @apiSuccess {Object} assignment The assignment object.
  */
	server.get('/assignments/:id', (req, res, next) => {
    db.ref('assignments/' + req.params.id).once("value").then(function(snapshot) {
      res.send(snapshot.val());
      next();
    }, function (error) {
      console.error(error);
    });
	});


  /**
   *  SEARCH
   */

   server.get('/search/:tag', (req, res, next) => {
      db.ref('tags/' + req.params.tag).once("value").then(function(snapshot) {
        res.send(snapshot.val());
        next();
      }, function (error) {
        console.error(error);
      });
   });

	/**
	 * UPDATE
	 */
	/*server.put('/todos/:todo_id', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'"),
			);
		}

		let data = req.body || {};

		if (!data._id) {
			data = Object.assign({}, data, { _id: req.params.todo_id });
		}

		Todo.findOne({ _id: req.params.todo_id }, function(err, doc) {
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
				);
			} else if (!doc) {
				return next(
					new errors.ResourceNotFoundError(
						'The resource you requested could not be found.',
					),
				);
			}

			Todo.update({ _id: data._id }, data, function(err) {
				if (err) {
					console.error(err);
					return next(
						new errors.InvalidContentError(err.errors.name.message),
					);
				}

				res.send(200, data);
				next();
			});
		});
	});*/

	/**
	 * DELETE
	 */
	/*server.del('/todos/:todo_id', (req, res, next) => {
		Todo.remove({ _id: req.params.todo_id }, function(err) {
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
				);
			}

			res.send(204);
			next();
		});
	});
  */
};
