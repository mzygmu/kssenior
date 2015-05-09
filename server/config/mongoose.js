var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    newsModel = require('../models/News'),
    contentModel = require('../models/PageContent'),
    competitionsModel = require('../models/Competitions'),
    participantResultModel = require('../models/ParticipantResult'),
    courseModel = require('../models/Course');

module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('kssenior db opened');
  });

  userModel.createDefaultUsers();
  newsModel.createDefaultNews();
  contentModel.createDefaultPageContent();
  courseModel.createDefaultCourses();

};

