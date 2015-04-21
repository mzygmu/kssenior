var User = require('mongoose').model('User'),
    encrypt = require('../utilities/encryption');

exports.getUsers = function(req, res) {
  User.find({}).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.createUser = function(req, res, next) {
  var userData = req.body;
  userData.username = userData.username.toLowerCase();
  userData.salt = encrypt.createSalt();
  userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
  User.create(userData, function(err, user) {
    if(err) {
      if(err.toString().indexOf('E11000') > -1) {
        err = new Error('Duplicate Username');
      }
      res.status(400);
      return res.send({reason:err.toString()});
    }
    req.logIn(user, function(err) {
      if(err) {return next(err);}
      res.send(user);
    })
  })
};

exports.updateUser = function(req, res) {
  var userUpdates = req.body;

  if(req.user._id != userUpdates._id && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }

  req.user.firstName = userUpdates.firstName;
  req.user.lastName = userUpdates.lastName;
  req.user.username = userUpdates.username;
  if(userUpdates.password && userUpdates.password.length > 0) {
    req.user.salt = encrypt.createSalt();
    req.user.hashed_pwd = encrypt.hashPwd(req.user.salt, userUpdates.password);
  }
  req.user.save(function(err) {
    if(err) { res.status(400); return res.send({reason:err.toString()});}
    res.send(req.user);
  });
};

exports.deleteUser = function(req, res) {
  var userData = req.body;
  User.remove( { _id : userData.user_id }, function(err, user) {
    if(err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.status(200);
    res.send();
  });
};

exports.addRights = function(req, res) {
  var userData = req.body;
  User.update(
    { _id : userData.user_id }, 
    {$addToSet:{roles:userData.rights}}); // update({_id:1}, {$push:{things: 'one'}}); // {$addToSet:{roles:userData.rights}};
  res.status(200);
  res.send();
};

exports.removeRights = function(req, res) {
  var userData = req.body;
  // set user admin // userData.user_id;  userData.rights
  var query = { _id : userData.user_id }; // which document
  var update = {$pull:{roles:userData.rights}}; // what change
  var options = {multi:false}; // one? many? upsert?
  console.log('rmRIGHTS '+userData.user_id+'\t'+userData.rights);
  User.update(query, update); // update({_id:1}, {$push:{things: 'one'}});
  res.status(200);
  res.send();
};