var mongoose = require('mongoose');

var newsSchema = mongoose.Schema({
  title: {type:String, required:'{PATH} is required!'},
  text: {type:String, required:'{PATH} is required!'}
});
var News = mongoose.model('News', newsSchema);


function createDefaultNews() {
  News.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      News.create({title: 'Nowa strona!', text: 'Witaj na nowej stronie naszego klubu!'});
    }
  })
}

exports.createDefaultNews = createDefaultNews;