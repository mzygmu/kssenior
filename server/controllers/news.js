var News = require('mongoose').model('News')

exports.getAll = function(req, res) {
  News.find({}).exec(function(err, collection) {
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

  req.news.title = newsUpdate.title;
  req.news.text = newsUpdate.text;

  req.news.save(function(err) {
    if(err) { res.status(400); return res.send({reason:err.toString()}); }
    res.send(req.news);
  });

}

exports.remove = function(req, res) {
  var newsUpdate = req.body;
  User.remove( { _id : newsUpdate.user_id }, function(err, user) {
    if(err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.status(200);
    res.send();
  });
};
