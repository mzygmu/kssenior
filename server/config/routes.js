'use strict';
var auth = require('./auth'),
  users = require('../controllers/users'),
  news = require('../controllers/news'),
  content = require('../controllers/content'),
  competitions = require('../controllers/competitions'),
  results = require('../controllers/results'),
  courses = require('../controllers/courses'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function(app) {

  app.get('/api/users', auth.requiresRole('admin'), 
    users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateUser);
  app.post('/api/users/remove', users.deleteUser);
  app.post('/api/users/addRights', users.addRights);
  app.post('/api/users/rmRights', users.removeRights);

  app.get('/api/news', news.getAll);
  app.post('/api/news', news.publish);
  app.put('/api/news', news.edit);
  app.post('/api/news/remove', news.remove);

  app.get('/api/content', content.getPageContent);
  app.post('/api/content', content.publish);
  app.put('/api/content', content.edit);
  app.post('/api/content/remove', content.remove);

  app.get('/api/competitions', competitions.getAll);
  app.post('/api/competitions', competitions.publish);
  app.put('/api/competitions', competitions.edit);
  app.post('/api/competitions/remove', competitions.remove);

  app.get('/api/results/:id', results.getResults);
  app.post('/api/results', results.publish);
  app.put('/api/results', results.edit);
  app.post('/api/results/remove', results.remove);

  app.get('/api/courses', courses.getCourses);
  app.get('/api/courses/:id', courses.getCourseById);

  

  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.post('/login', auth.authenticate);

  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });

  app.all('/api/*', function(req, res) {
    res.send(404);
  });

  app.get('*', function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
}