

module.exports = function(app) {

// temporary
// var messageSchema = mongoose.messageSchema({message: String});
// var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
// Message.findOne().exec(function(err, messageDoc) {
//   mongoMessage = messageDoc.message;
// });

mongoMessage = 'test';

  // app.get('/partials/*', function(req, res) {
  //   res.render('../../public/app/' = req.params[0]);
  // });
  app.get('/partials/:partialPath', function(req, res) {
    res.render('partials/' = req.params.partialPath);
  });
  app.get('*', function(req, res) {
    res.render('index', {
      // temp
      mongoMessage: mongoMessage
    });
  });

}