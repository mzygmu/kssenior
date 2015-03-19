var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var http = require('http');
var requestLib = require('request');

var pg = require('pg');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

var application_id = 'eb474e26fc7d5fb9ccf7ceab5b71e7dd';
var keyPattern = /^[a-zA-Z0-9]{16,32}$/;
var booleanPattern = /^[a-z]{4,5}$/;
var beDatePattern = /20\d{2}(-|\/)((0[1-9])|(1[0-2])|([1-9]))(-|\/)(([1-9])|(0[1-9])|([1-2][0-9])|(3[0-1]))/;
var datePattern = /20\d{2}(-|\/)((0[1-9])|(1[0-2])|([1-9]))(-|\/)(([1-9])|(0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/;
var onlyNumberPattern = /^[0-9]+$/; 
var numberAndCharPattern = /^[a-zA-Z0-9]+$/;
var battleTypePattern = /([0-9]{0,3}[,]*)*/; 
var idComaPattern = /([0-9]{0,10}[,]*)*/; 

var blackListOfSqlKeyWords = ['--','=','!','<','>',';',' * ','delete ','select ',' where',' from',' table','insert into','alter ',' values', ' database', ' and ',' not null', 'notnull', 'procedure ',' goto',' or ', ' as ', 'execute ',' column', 'drop ', ' exit', 'exec ', 'execute ', ' proc'];
var isOnBlackList = function(param) {
  for(var i in blackListOfSqlKeyWords) {
    var wordsCount = 0;
    if(param && param.toString().toLowerCase().indexOf(blackListOfSqlKeyWords[i]) > -1) {
      wordsCount++;
    }
    if (wordsCount >= 3) {
      console.error('[SQL INJECTION] '+param); 
      return true;
    }
  }
  return false;
};

var isSqlInjection = function(obj) {
  var result = false;
  for (var i in obj) {
    var v = obj[i];
    var isObj = (v instanceof Object);

    if (isObj) {
      result |= isSqlInjection(v);
    } else if (i === 'key') {
      result |= !keyPattern.test(v);
    } else if (i === 'player_id' || i === 'commander_id' || i === 'pid' || i === 'clanId' || i === 'tank_id' || i === 'source') {
      result |= !onlyNumberPattern.test(v);
    } else if (i === 'availability') {
      result |= !booleanPattern.test(v);
    } else if (i === 'availabilityId' || i === 'msgId' || i === 'id' || i === 'number' || i === 'days' || i === 'availableDelay' 
        || i === 'limit' || i === 'base' || i === 'type') {  // ??? arena_id
      result |= !onlyNumberPattern.test(v);
    } else if (i === 'date') {
      result |= !datePattern.test(v);
    } else if (i === 'begin_date' || i === 'end_date') {
      result |= !beDatePattern.test(v);
    } else if (i === 'typeOfBattleAsPresent') { // 2,5,7,10,11
      result |= !battleTypePattern.test(v);
    } else if (i === 'admins' || i === 'commanders') { // 2123323,1231235,1121320,1134211
      result |= !idComaPattern.test(v);
    } else { 
      result |= isOnBlackList(v);    
    }
    if (result) {
      console.error('[SQL INJECTION] key:'+i+'\t value:'+v); 
      return result;
    }
  }
  return result;
}

app.get('/sqlAction', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('UPDATE clan_config SET admins=\'501488279,502228895,502399221,502642976,502763701,502895601,504517503\' WHERE clan_id=500004626', function(err, result) {
    // client.query('ALTER TABLE player_battle ADD COLUMN tank_id int', function(err, result) {
      done();
      if (err) { 
        console.error(err); 
        response.statusCode = 400;
        response.send();
      } else { 
        response.statusCode = 200;
        response.send();
      }
    });
  });
});