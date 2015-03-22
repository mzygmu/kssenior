npm init
npm install bower --save-dev

bower init
bower install jquery --save
bower install toastr --save
bower install angular angular-resource angular-route --save

npm install nodemon -g

// set NODE_ENV=development
// heroku config:set NODE_ENV=production
foreman start web
nodemon server.js


To run this application, start your mongo server & do the following from the command line:
bower install
npm install
nodemon server.js


ng-repeat="course in coutses | filter:{featured:true}"

ng-repeat="course in coutses | orderBy:'published':true | limitTo:10"