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



script(type="text/javascript", src="/vendor/jquery/dist/jquery.js")
script(type="text/javascript", src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js")
script(type="text/javascript", src="/vendor/toastr/toastr.js")
script(type="text/javascript", src="/vendor/angular/angular.js")
script(type="text/javascript", src="/vendor/angular-resource/angular-resource.js")
script(type="text/javascript", src="/vendor/angular-route/angular-route.js")
script(type="text/javascript", src="/vendor/ui-bootstrap-custom/ui-bootstrap-custom-0.11.2.min.js")
script(type="text/javascript", src="/vendor/ui-bootstrap-custom/ui-bootstrap-custom-tpls-0.11.2.min.js")