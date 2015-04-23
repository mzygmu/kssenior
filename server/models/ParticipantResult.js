var mongoose = require('mongoose');

var participantResultSchema = mongoose.Schema({
  competition_id: {type:String, required:'{PATH} is required!'},
  name: {type:String, required:'{PATH} is required!'},
  score: {type:Double, required:'{PATH} is required!'},
  club: String,
  notes: String
});
var ParticipantResult = mongoose.model('ParticipantResult', participantResultSchema);