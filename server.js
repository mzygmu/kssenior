var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);

require('./server/config/mongoose')(config);

require('./server/config/passport')();

require('./server/config/routes')(app);

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');

var libs = [
'./public/vendor/jquery/dist/jquery.min.js',
'./public/vendor/bootstrap/dist/js/bootstrap.min.js',
'./public/vendor/toastr/toastr.min.js',
'./public/vendor/angular/angular.min.js',
'./public/vendor/angular-resource/angular-resource.min.js',
'./public/vendor/angular-route/angular-route.min.js',
'./public/vendor/ui-bootstrap-custom/ui-bootstrap-custom-0.11.2.min.js',
'./public/vendor/ui-bootstrap-custom/ui-bootstrap-custom-tpls-0.11.2.min.js',
];
var scripts = [
'./public/app/app.js',
'./public/app/main/mvMainCtrl.js',
'./public/app/account/loginModalCtrl.js',
'./public/app/account/mvNavBarLoginCtrl.js',
'./public/app/account/mvIdentity.js',
'./public/app/common/mvNotifier.js',
'./public/app/common/confirmCtrl.js',
'./public/app/account/mvAuth.js',
'./public/app/account/mvUser.js',
'./public/app/account/mvManageUsers.js',
'./public/app/account/mvSignupCtrl.js',
'./public/app/account/mvProfileCtrl.js',
'./public/app/admin/mvUserListCtrl.js',

'./public/app/news/newsList.js',
'./public/app/news/newsListCtrl.js',
'./public/app/news/newsResource.js',
'./public/app/news/publishPostCtrl.js',
'./public/app/news/publishService.js',
'./public/app/pages/cachedPageContent.js',
'./public/app/pages/contentModalCtrl.js',
'./public/app/pages/pageContentCtrl.js',
'./public/app/pages/pageContentResource.js',
'./public/app/pages/pageContentService.js',
'./public/app/competitions/cachedCompetitions.js',
'./public/app/competitions/competitionsCtrl.js',
'./public/app/competitions/competitionsModalCtrl.js',
'./public/app/competitions/competitionsResource.js',
'./public/app/competitions/competitionsService.js',
'./public/app/competitions/resultModalCtrl.js',
'./public/app/competitions/resultService.js'
];
// './public/app/news/newsDirectives.js',

var compressor = require('node-minify');
new compressor.minify({
    type: 'gcc',
    fileIn: scripts,
    fileOut: 'public/app/ks-senior.js',
    callback: function(err, min){
        console.log(err);
//        console.log(min); 
    }
});

new compressor.minify({
    type: 'no-compress',
    fileIn: libs,
    fileOut: 'public/app/ks-senior-libs.js',
    callback: function(err, min){
        console.log(err);
//        console.log(min); 
    }
});