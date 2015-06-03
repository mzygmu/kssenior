'use strict';
var Competitions = require('mongoose').model('Competitions');

exports.getAll = function(req, res) {
  Competitions.find({}).sort( { date: 1 } ).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.publish = function(req, res) {
  var data = req.body;
  Competitions.create(data, function(err, news) {
      if (err) {
        res.status(400);
        return res.send({reason:err.toString()});
      }
      res.status(200);
      res.send();
    }
  );
}

exports.edit = function(req, res) {
  var data = req.body;

  if(!req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }

  Competitions.update(
    { _id : data._id }, 
    {
      $set: data
      // $set: {
      //   title: data.title,
      //   competition: data.competition,
      //   date: data.date,
      //   category: data.category,
      //   types: data.types,
      //   notes: data.notes,
      //   description: data.description
      // }
    },
    function(err, user) {
      if(err) {
        res.status(400);
        return res.send({reason:err.toString()});
      }
      res.status(200);
      res.send();
    }
  );
}

exports.remove = function(req, res) {
  var data = req.body;

  Competitions.remove( { _id : data.id }, function(err, user) {
    if(err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.status(200);
    res.send();
  });
};