var mongoose = require('mongoose');

var newSchema = mongoose.Schema({
  title: {type:String, required:'{PATH} is required!'},
  text: {type:String, required:'{PATH} is required!'}
});
var News = mongoose.model('News', newsSchema);
