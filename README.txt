npm init
npm install bower --save-dev

bower init
bower install jquery --save
bower install toastr --save
bower install angular angular-resource angular-route --save

npm install nodemon -g


foreman start web


ng-repeat="course in coutses | filter:{featured:true}"

ng-repeat="course in coutses | orderBy:'published':true | limitTo:10"