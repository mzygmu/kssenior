var PageContent = require('mongoose').model('PageContent');

exports.getPageContent = function(req, res) {
  PageContent.find({}).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.publish = function(req, res) {
  var data = req.body;
  PageContent.create(data, function(err, news) {
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

  PageContent.update(
    { _id : data._id }, 
    {
      $set: {
      	pageId: data.pageId,
      	sectionTitle: data.sectionTitle,
        text: data.text,
        position: data.position
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
  var data = req.body;

  News.remove( { _id : data.id }, function(err, user) {
    if(err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.status(200);
    res.send();
  });
};