var Results = require('mongoose').model('ParticipantResult');
var Competitions = require('mongoose').model('Competitions');

exports.getResults = function(req, res) {
  Results.find({competition_id:req.params.id}).sort( { place: 1 } ).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.publish = function(req, res) {
  var data = req.body;
  Results.create(data, function(err, news) {
      if (err) {
        res.status(400);
        return res.send({reason:err.toString()});
      } else {
        Competitions.update(
          { _id : data.competition_id }, 
          {
            $set: {
              resultsOn: true
            }
          },
          function(err, user) {

          }
        );      
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

  Results.update(
    { _id : data._id }, 
    {
      $set: data
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

  Results.remove( { _id : data.id }, function(err, user) {
    if(err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.status(200);
    res.send();
  });
};