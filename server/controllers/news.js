var News = require('mongoose').model('News')

exports.getAll = function(req, res) {

  News.find({}).sort( { _id: -1 } ).limit( 10 ).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.publish = function(req, res) {
  var newsData = req.body;
  News.create(newsData, function(err, news) {
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
  var newsUpdate = req.body;

  if(!req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }

  News.update(
    { _id : newsUpdate._id }, 
    {
      $set: {
        title: newsUpdate.title,
        text: newsUpdate.text
      }
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
  var newsDelete = req.body;

  News.remove( { _id : newsDelete.id }, function(err, user) {
    if(err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.status(200);
    res.send();
  });
};
