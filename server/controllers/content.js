var PageContent = require('mongoose').model('PageContent');

exports.getPageContent = function(req, res) {
  PageContent.find({}).exec(function(err, collection) {
    res.send(collection);
  })
};
