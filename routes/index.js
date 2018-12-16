const restify = require('restify');
const errors = require('restify-errors');
const crypto = require('crypto');
const queryString = require('query-string');
const config = require('../config');
const db = config.db;

module.exports = function(server) {
  server.get('/', restify.plugins.conditionalHandler([
    { version: '1.0.0', handler: (req, res, next) => {
      res.send('Hello world, v1');
    } },
    { version: '2.0.0', handler: (req, res, next) => {
      res.send('Hello world, v2');
    } }
  ]));

  /**
    * @api {post} /assignment/create Create a new Assignment
    * @apiName Post
    * @apiGroup Assignment
    *
    * @apiSuccess {String} assignment The assignment id.
  */
	server.post('/assignment/create', restify.plugins.conditionalHandler([
    { version: '1.0.0', handler: (req, res, next) => {
      let shasum = crypto.createHash('sha1');
      shasum.update(req.body.name + Date.now());
      let id = shasum.digest('hex');
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
  	 }
    },
    { version: '2.0.0', handler: (req, res, next) => {
      let shasum = crypto.createHash('sha1');
      shasum.update(req.body.name + Date.now());
      let id  = shasum.digest('hex');
      const tags = req.body.tags;

      const assignment = {
        id: id,
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        tags: [],
      };

      if (tags.length > 0 && tags[0] != '') {
        tags.forEach(function(tag) {
          const href = config.base_url + `/assignment/search/${tag}`;
          db.ref('v2/tags').child(tag).push({
            id: tag,
            assignment: id,
            href: href,
          })
          .then((ref) => {
            assignment.tags.push({tag: tag, ref: ref.key, href: href});
            db.ref('v2/assignments').child(id).set(assignment);
          });
        });
      }

      res.send(id);
      next();
    }}
  ]))

  /**
    * @api {get} /assignment/ Request All Assignment information
    * @apiName Get
    * @apiGroup Assignment
    *
    * @apiSuccess {Object} assignment All assignments.
  */
	server.get('/assignment', restify.plugins.conditionalHandler([
    { version: '1.0.0', handler: (req, res, next) => {
      db.ref('assignments').once("value").then(function(snapshot) {
        res.send(snapshot.val());
        next();
      }, function (error) {
        console.error(error);
      });
  	}},
    { version: '2.0.0', handler: (req, res, next) => {
      db.ref('v2/assignments').once("value").then(function(snapshot) {
        res.send(snapshot.val());
        next();
      }, function (error) {
        console.error(error);
      });
  	}}]));



  /**
    * @api {get} /assignment/:id Request Assignment information
    * @apiName Get
    * @apiGroup Assignment
    *
    * @apiParam {String} id Assignment UUID.
    *
    * @apiSuccess {Object} assignment The assignment object.
  */
	server.get('/assignment/:id', restify.plugins.conditionalHandler([
    { version: '1.0.0', handler: (req, res, next) => {
      db.ref('assignments/' + req.params.id).once("value").then(function(snapshot) {
        res.send(snapshot.val());
        next();
      }, function (error) {
        console.error(error);
      });
  	}},
    { version: '2.0.0', handler: (req, res, next) => {
      db.ref('v2/assignments/' + req.params.id).once("value").then(function(snapshot) {
        res.send(snapshot.val());
        next();
      }, function (error) {
        console.error(error);
      });
    }}]));



  /**
    * @api {get} /assignment/search/:id Search assignments
    * @apiName Get
    * @apiGroup Search
    *
    * @apiParam {String} id Assignment UUID.
    *
    * @apiSuccess {Object} assignment The assignment object.
  */

   server.get('/assignment/search/:tag', restify.plugins.conditionalHandler([
     { version: '1.0.0', handler: (req, res, next) => {
        db.ref('tags/' + req.params.tag).once("value").then(function(snapshot) {
          res.send(snapshot.val());
          next();
        }, function (error) {
          console.error(error);
        });
     }},
     { version: '2.0.0', handler: (req, res, next) => {
        db.ref('v2/tags/' + req.params.tag).once("value").then(function(snapshot) {
          res.send(snapshot.val());
          next();
        }, function (error) {
          console.error(error);
        });
     }}]))


	/**
	 * UPDATE : not implemented
	 */
   server.put('/assignment/update', restify.plugins.conditionalHandler([
     { version: '2.0.0', handler: (req, res, next) => {

       db.ref('v2/assignments').child(req.body.id).once("value").then(function(snapshot) {
         const tags = snapshot.val().tags;

         if (tags) {
           tags.forEach((tag) => {
             db.ref('v2/tags').child(tag.tag).child(tag.ref).remove();
           });
           db.ref('v2/assignments').child(req.body.id).remove().then(function(snapshot) {
             // res.send(200);
             next();
           }, function (error) {
             console.error(error);
           })
         }



       const newTags = req.body.tags;

       const assignment = {
         id: req.body.id,
         name: req.body.name,
         title: req.body.title,
         description: req.body.description,
         tags: [],
       };

       if (newTags.length > 0 && newTags[0] != '') {
         newTags.forEach(function(tag) {
           if (tag !== '') {
             const href = config.base_url + `/assignment/search/${tag}`;
             db.ref('v2/tags').child(tag).push({
               id: tag,
               assignment: req.body.id,
               href: href,
             })
             .then((ref) => {
               assignment.tags.push({tag: tag, ref: ref.key, href: href});
             });
           }

           db.ref('v2/assignments').child(req.body.id).set(assignment);

         });
       }

       res.send(200);
       next();
     })
   }}]));

	/**
	 * DELETE
	 */
   server.del('/assignment/delete', restify.plugins.conditionalHandler([
     { version: '2.0.0', handler: (req, res, next) => {
       db.ref('v2/assignments/' + req.body.id).once("value").then(function(snapshot) {
         const tags = snapshot.val().tags;

         tags.forEach((tag) => {
           db.ref('v2/tags').child(tag.tag).child(tag.ref).remove();
         });
         db.ref('v2/assignments').child(req.body.id).remove().then(function(snapshot) {
           res.send(200);
           next();
         }, function (error) {
           console.error(error);
         });
       }, function (error) {
         console.error(error);
       });
   }}]));

};
