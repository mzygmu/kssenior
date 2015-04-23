var mongoose = require('mongoose');

var competitionsSchema = mongoose.Schema({
  title: {type:String, required:'{PATH} is required!'},
  competition: {type:[String], required:'{PATH} is required!'},
  date: {type:Date, required:'{PATH} is required!'},
  category: [String],
  types: [String],
  notes: String
});
var Competitions = mongoose.model('Competitions', competitionsSchema);
