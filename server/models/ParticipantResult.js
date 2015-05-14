var mongoose = require('mongoose');

var participantResultSchema = mongoose.Schema({
  competition_id: {type:String, required:'{PATH} is required!'},
  competition_name: {type:String, required:'{PATH} is required!'},
  name: {type:String, required:'{PATH} is required!'},
  total: {type:Number, required:'{PATH} is required!'},
  place: {type:Number, required:'{PATH} is required!'},
  series: [Number],
  club: String,
  notes: String
});
var ParticipantResult = mongoose.model('ParticipantResult', participantResultSchema);