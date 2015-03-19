var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var http = require('http');
var requestLib = require('request');

var ev = require('./expected_tank_values_18.json');
var frozen = require('./frozenTimes.json');
var tanksMap = require('./tanksMap.json');
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

var isCommander = function(commanders, player_id) {
  if (commanders) {
    return commanders.indexOf(''+player_id) > -1;
  } else {
    return false;
  }
}

var isAdmin = function(admins, player_id) {
  if (admins) {
    return admins.indexOf(''+player_id) > -1;
  } else {
    return false;
  }
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

// CREATE TABLE paypal_txn (txn_id varchar(50), clan_id int NOT NULL, price numeric(10,2) NOT NULL, ccy varchar(12) NOT NULL, quantity smallint NOT NULL, time_stamp timestamp DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(txn_id))
app.post('/paypal', function (req, response) {
  var json = req.body;
  var headers = req.headers;

  var isPP = headers['user-agent'].indexOf('https://www.paypal.com/ipn') != -1;
  var id = json.txn_id;
  var isDone = (json.payment_status === 'Completed');
  var sellerEmail = json.receiver_email; // wotcca-facilitator@gmail.com

  var clan_id = json.item_name; 
  var ccy = json.mc_currency;
  var price = json.mc_gross;
  var quantity = json.quantity;

  var isPriceOK = (price > 11.5 && ccy == 'USD') || (price > 9.5 && ccy == 'EUR') || (price > 39.5 && ccy == 'PLN') || (price > 7.5 && ccy == 'GBP');
  var isQuantity = (quantity == 1 || quantity == 3 || quantity == 6 || quantity == 12);

  var isMessageOK = isDone && isPP && isPriceOK && isQuantity && sellerEmail === 'wotcca@gmail.com';

  if (isMessageOK) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM paypal_txn WHERE txn_id=\''+id+'\'', function(err, result) {
        done();
        if (!err) {
          if (result.rowCount == 0) {
            client.query('INSERT INTO paypal_txn VALUES (\''+ id +'\', '+ clan_id+', '+price+', \''+ ccy+'\', '+quantity+')', function(err, result) { 
              done();
              if (err)
               { console.error(err); }
              else
               { 
                client.query('SELECT validdate FROM clan_config WHERE clan_id='+clan_id, function(err, result) {
                  done();
                  if (!err) {
                    var date = new Date(result.rows[0].validdate);
                    var now = new Date();

                    var newTime;
                    if (date.getTime() > now.getTime()) {
                      newTime = date.getTime() + (2592000000 * quantity);
                    } else {
                      newTime = now.getTime() + (2592000000 * quantity);
                    }
                    // convert to DB format
                    newTime = newTime / 1000;

                    client.query('UPDATE clan_config SET validdate=to_timestamp('+newTime+') WHERE clan_id='+clan_id, function(err, result) {
                      done();
                      if (!err) {
                        response.statusCode = 200;
                        response.send();
                      } else {
                        console.error(err);
                      }
                    });
                  } else {
                    console.error(err);
                  }
                });
                
               }
            });
          } else { // already added
            response.statusCode = 200;
            response.send();
          }
        } else {
          console.error(err);
        }
      });

    });
  } else {
    response.statusCode = 400;
    response.send();
  }

  //req.pipe(request.post('https://www.paypal.com/ipn', {form:req.body}));
  // --- CONFIRMATION ---
  // var PPoptions = {
  //     host: 'https://www.paypal.com',
  //     //port: 80, lub 443
  //     path: '/ipn',
  //     method: 'POST'
  // };
  // var req = http.request(PPoptions, function(res){
  //     console.log('status: ' + res.statusCode);
  //     //console.log('headers: ' + JSON.stringify(res.headers));
  //     //res.setEncoding('utf8');
  //     res.on('data', function(chunk){
  //         console.log("body: " + chunk);
  //     });
  // });

  // req.on('error', function(e) {
  //     console.log('problem with request: ' + e.message);
  // });

  // // write data to request body
  // req.write(request);
  // req.end();
  // --- END ---

});

var updatePlayersDataInClan = function(clan_id, currentMembersIds) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM player_clan WHERE clan_id='+clan_id, function(err, result) { 
        done();
        if (err) {
          return;
        }
        for  (var i in result.rows) {
          var pid = result.rows[i].player_id;
          if (currentMembersIds.indexOf(','+pid+',') == -1) {
            console.log('DELETE Player id '+pid+'\t\tclan_id: '+clan_id);

            var deleteQuery = '';
            deleteQuery += 'DELETE FROM player_note       WHERE player_id='+pid+'; ';
            deleteQuery += 'DELETE FROM availability      WHERE player_id='+pid+'; ';
            deleteQuery += 'DELETE FROM player_tank       WHERE player_id='+pid+'; ';
            deleteQuery += 'DELETE FROM player_tank_stats WHERE player_id='+pid+'; ';
            deleteQuery += 'DELETE FROM player_clan       WHERE player_id='+pid+'; ';

            client.query(deleteQuery, function(err, result) {
              done();
            });
          }
        }
      }
    );
  });
};

var tanksForWN8 = '16161'; // M53/M55
var tanksForWN8_t6 = '';
var saveWN8 = function(player_id, tank_id, clan_id, wn8value, battles, win) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM player_tank_stats WHERE player_id='+player_id+' AND tank_id='+tank_id, 
      function(err, result) {
        done();
        if (result.rows.length == 0) {
          client.query('INSERT INTO player_tank_stats (player_id, tank_id, clan_id, stats, battles, win) VALUES ('
              +player_id+', '+tank_id+', '+clan_id+', '+wn8value+', '+battles+', '+win+')', function(err, result) {
            done();
            if (err) { 
              console.error(err); 
            }
          });
        } else {
          client.query('UPDATE player_tank_stats SET stats='+wn8value+', battles='+battles+', win='+win+', clan_id='+clan_id+' WHERE player_id='+player_id+' AND tank_id='+tank_id, function(err, result) {
            done();
            if (err) { 
              console.error(err); 
            }
          });
        }
      }
    );
  });
};

var calculateWN8 = function(player_id, clan_id, data) {  
  var tanksStats = data[player_id];
  if (tanksStats) {
    for (var i in tanksStats) {
      var tank = tanksStats[i];

      var battles = tank.all.battles;
      if (battles === 0) {
        continue;
      }

      var avgDmg = tank.all.damage_dealt / battles;
      var avgSpot = tank.all.spotted / battles;
      var avgFrag = tank.all.frags / battles;
      var avgDef = tank.all.dropped_capture_points / battles;
      var avgWinRate = tank.all.wins * 100 / battles;

      for (var i in ev.data) {
        var tank_id = ev.data[i].IDNum;
        if (tank_id === tank.tank_id) {          
          var expFrag = ev.data[i].expFrag;
          var expDmg = ev.data[i].expDamage;
          var expSpot = ev.data[i].expSpot;
          var expDef = ev.data[i].expDef;
          var expWinRate = ev.data[i].expWinRate;

          var rDAMAGE = avgDmg     / expDmg;
          var rSPOT   = avgSpot    / expSpot;
          var rFRAG   = avgFrag    / expFrag;
          var rDEF    = avgDef     / expDef;
          var rWIN    = avgWinRate / expWinRate;

          var rWINc    = Math.max(0,                          (rWIN    - 0.71) / (0.29) );
          var rDAMAGEc = Math.max(0,                          (rDAMAGE - 0.22) / (0.78) );
          var rFRAGc   = Math.max(0, Math.min(rDAMAGEc + 0.2, (rFRAG   - 0.12) / (0.88)));
          var rSPOTc   = Math.max(0, Math.min(rDAMAGEc + 0.1, (rSPOT   - 0.38) / (0.62)));
          var rDEFc    = Math.max(0, Math.min(rDAMAGEc + 0.1, (rDEF    - 0.10) / (0.90)));

          var WN8 = (980*rDAMAGEc) + (210*rDAMAGEc*rFRAGc) + (155*rFRAGc*rSPOTc) + (75*rDEFc*rFRAGc) + (145*Math.min(1.8,rWINc));
          var wn8value = parseFloat(WN8).toFixed(2);

          saveWN8(player_id, tank_id, clan_id, wn8value, tank.all.battles, tank.all.wins);        
        }
      }
    }
  }
}

var processPlayerData = function(pid, cid) {
  requestLib.post('https://api.worldoftanks.eu/wot/tanks/stats/',
    { form: 'application_id='+application_id+'&account_id='+pid+'&tank_id='+tanksForWN8 },
    function (error, res, body) {
      if (!error && res.statusCode == 200) {
        var body = JSON.parse(body);
        if (body.data) {
          //console.log('[Calculate] player_id: '+pid);
          calculateWN8(pid, cid, body.data);
        } else {
          console.log('[ERROR] code: '+res.statusCode+'\t data: ' +JSON.stringify(body.data));
        }
      }
    }
  );

  requestLib.post('https://api.worldoftanks.eu/wot/tanks/stats/',
    { form: 'application_id='+application_id+'&account_id='+pid+'&tank_id='+tanksForWN8_t6 },
    function (error, res, body) {
      if (!error && res.statusCode == 200) {
        var body = JSON.parse(body);
        if (body.data) {
          //console.log('[Calculate t6] player_id: '+pid);
          calculateWN8(pid, cid, body.data);
        } else {
          console.log('[ERROR t6] code: '+res.statusCode+'\t data: ' +JSON.stringify(body.data));
        }
      }
    }
  );
};

var updateWN8forClan = function(clan_id) {
  requestLib.post('https://api.worldoftanks.eu/wgn/clans/info/',
    { form: 'application_id='+application_id+'&clan_id='+clan_id },
    function (error, res, body) {
      if (!error && res.statusCode == 200) {
        var b = JSON.parse(body);
        var members = b.data[clan_id].members;
        // get list of players from clan
        var membersIdList = '';
        for (var i in members) {
          if (membersIdList.length != 0) {
            membersIdList += ',';
          }
          var player_id = members[i].account_id;
          membersIdList += player_id;

          processPlayerData(player_id, clan_id); // WN8 
        }
        updatePlayersDataInClan(clan_id, ','+membersIdList+',');
      }
    }
  );
}

var updateClanData = function() {
  console.log('--------- UPDATE CLANs DATA START');    
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM clan_config', function(err, result) {
      done();
      if (!err) {
        for (var i in result.rows) {
          var cid = result.rows[i].clan_id;
          updateWN8forClan(cid);
        }
      }
    });
  });
};

requestLib.post('https://api.worldoftanks.eu/wot/encyclopedia/tanks/',
  { form: 'application_id='+application_id+'&fields=level,tank_id,short_name_i18n,type' },
  function (error, res, body) {
    if (!error && res.statusCode == 200) {
      var b = JSON.parse(body);

      for (var i in b.data) {
        var tank = b.data[i];
        //console.log(JSON.stringify(tank));
        if (tank.level === 10 || tank.level === 8) {
          tanksForWN8 += ','+tank.tank_id;
        } else if (tank.level === 6 || (tank.level === 7 && tank.type === 'lightTank')) {
          tanksForWN8_t6 += tank.tank_id + ',';
        }
      }
      console.log('--------- INITED update function');  
    }
  }
);

app.get('/updateClanData', function (request, response) {
  updateClanData();
  response.statusCode = 200;
  response.send();
});

app.get('/updateScorpen', function (request, response) {
  processPlayerData(500307618, 500001749); // WN8 
  response.statusCode = 200;
  response.send();
});

var updatePrivilages = function(clan_id) {
  requestLib.post('https://api.worldoftanks.eu/wgn/clans/info/',
    { form: 'application_id='+application_id+'&clan_id='+clan_id },
    function (error, res, body) {
      if (!error && res.statusCode == 200) {
        var b = JSON.parse(body);
        var members = b.data[clan_id].members;
        var commandersIds = [];          

        for (var i in members) {
          var player_id = members[i].account_id;
          var role = members[i].role;

          if (role === 'commander' || role === 'executive_officer') {
            commandersIds.push(player_id);
          }
        }

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
          client.query('SELECT * FROM clan_config WHERE clan_id='+clan_id, function(err, result) {
            done();
            if (!err) {
              var admins = result.rows[0].admins;
              var update = false;              
              var a = ','+ admins +',';

              for (var i in commandersIds) {
                var pid = commandersIds[i];
                if (a.indexOf(','+pid+',') === -1) {
                  admins += ','+ pid;
                  update = true;
                }
              }
              
              if (update) {
                client.query('UPDATE clan_config SET admins=\''+admins+'\' WHERE clan_id='+clan_id, function(err, result) {
                  done(); 
                });
              }
            }
          });
        });
      }
    }
  );
};

var updateClansPrivilages = function() {
  console.log('--------- UPDATE CLANs Privilages START'); 
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM clan_config', function(err, result) {
      done();
      if (!err) {
        for (var i in result.rows) {
          var cid = result.rows[i].clan_id;
          updatePrivilages(cid);
        }
      }
    });
  });
}

app.get('/updatePrivilages', function (request, response) {
  updateClansPrivilages();
  response.statusCode = 200;
  response.send();
});

// CREATE TABLE player_tank_stats (player_id int NOT NULL, tank_id int NOT NULL, clan_id int, frozenDate timestamp, stats numeric(6,2), battles int, win int)
// ALTER TABLE player_tank_stats ADD CONSTRAINT unique_player_tank_stats UNIQUE (player_id, tank_id);
// CREATE INDEX ptstats_index ON player_tank_stats (clan_id, tank_id);
app.post('/tanksStats', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;
            
            var WHERE = 'clan_id='+clan_id;
            if (json.tank_id) {
              WHERE += ' AND tank_id='+json.tank_id; 
            } else {
              WHERE += ' ORDER BY stats DESC';
            }           
            client.query('SELECT * FROM player_tank_stats WHERE '+WHERE, function(err, result) { 
                done();
                if (err)
                 { console.error(err); response.statusCode = 500; response.send(); }
                else { 
                  response.statusCode = 200;
                  response.setHeader('Content-Type', 'application/json');
                  response.json(result.rows);
                }
              });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });

    });
  }
});

// CREATE TABLE player_tank (player_id int NOT NULL, tank_id int NOT NULL)
// ALTER TABLE player_tank ADD CONSTRAINT unique_player_tank UNIQUE (player_id, tank_id);
// CREATE INDEX player_tank_index ON player_tank (player_id);
app.post('/updateTanks', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) { 
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length > 0 && result.rows[0].player_key === json.key) { 

            client.query('SELECT tank_id FROM player_tank WHERE player_id='+json.player_id, function(err, result) { 
              done();
              if (err)
               { console.error(err); response.statusCode = 500; response.send(); }
              else {  
                var stayTanks = ',';

                // DB tanks
                for (var i in result.rows) {
                  var db_tank_id = result.rows[i].tank_id;

                  if (json.tanks.indexOf(','+db_tank_id+',') > -1) {
                    stayTanks += db_tank_id+',';
                  } else {
                    client.query('DELETE FROM player_tank WHERE player_id='+json.player_id+' AND tank_id='+db_tank_id, function(err, result) {
                      done();
                    });
                  }
                }

                for (var t in json.id_list) {
                  var tid = json.id_list[t].tank_id;
                  if (stayTanks.indexOf(','+tid+',') == -1) {
                    client.query('INSERT INTO player_tank VALUES ('+json.player_id+','+tid+', false)', function(err, result) {
                      done();              
                    });
                  }
                }

                response.statusCode = 200;
                response.send(); 
              }
            }); // end of tank_id

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });

    });
  }
});

app.post('/clantanks', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT player_tank.tank_id, COUNT(*) FROM player_tank INNER JOIN player_clan ON player_clan.player_id = player_tank.player_id WHERE player_clan.clan_id='+clan_id+' GROUP BY player_tank.tank_id', function(err, result) { 
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json(result.rows);
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
})

// ADMIN case too
app.post('/addAvailability', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;

    // CREATE SEQUENCE availability_id_seq;
    // CREATE TABLE availability (avail_id int DEFAULT nextval('availability_id_seq'), player_id int NOT NULL, available boolean, avail_date date NOT NULL, PRIMARY KEY(avail_id));
    // ALTER TABLE availability ADD CONSTRAINT avial_unique UNIQUE (player_id, avail_date);
    // CREATE INDEX availability_index ON availability (player_id);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json[0].player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json[0].key) {
            if (json[0].pid === json[0].player_id || isAdmin(result.rows[0].admins, json[0].player_id) ) {

              response.statusCode = 200;

              for (i=0; i<json.length; i++) {
                var pid = json[i].pid;
                var availability = json[i].availability;
                var date = json[i].date;

                // new version
                client.query('INSERT INTO availability (player_id, available, avail_date) VALUES ('+pid+','+availability+', \''+date+'\')', function(err, result) {
                  done();
                  if (err)
                   { 
                    console.error(err);
                    response.statusCode = 500;                   
                   }
                  else
                   {  
                    console.log('Successfully added an availability for player_id:'+pid);                  
                   }
                });
              }

              response.send();
            }
          } else {
            console.log('[addAvailability] rows:'+result.rows.length+ ' key sent: '+json[0].key+'   player_id: '+pid);
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

app.post('/getAvailability', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {

      // TODO request is to quick

      // client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
      //   done();
      //   if (err)
      //    { console.error(err); response.statusCode = 500; response.send(); }
      //   else
      //    {  
      //     if (result.rows.length == 1 && result.rows[0].player_key === json.key) {
      //       var clan_id = result.rows[0].clan_id; 

            client.query('SELECT * FROM availability WHERE player_id='+json.pid+' AND avail_date >= CURRENT_DATE -'+json.limit+' ORDER BY avail_date DESC', function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json(result.rows);
               }
            });

      //     } else {
      //       response.statusCode = 403;
      //       response.send();
      //     }
      //    }
      // });
    });
  }
});

app.post('/getClanAvailability', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT availability.player_id, availability.available, availability.avail_date FROM availability INNER JOIN player_clan ON player_clan.player_id = availability.player_id WHERE player_clan.clan_id='+clan_id+' AND availability.avail_date >= CURRENT_DATE AND availability.avail_date < CURRENT_DATE +'+request.body.days+' ORDER BY availability.player_id, availability.avail_date ASC LIMIT ALL', function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json(result.rows);
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// Admin case too
app.post('/deleteAvailability', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key) {
            if (json.pid === json.player_id || isAdmin(result.rows[0].admins, json.player_id) ) {

              client.query('DELETE FROM availability WHERE avail_id='+json.availabilityId+'AND player_id='+json.pid, function(err, result) {
                done();
                if (err)
                 { console.error(err); response.send(); }
                else
                 {         
                  response.send(result.rows); 
                 }
              });

            }
          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });    
    });
  }
});

app.post('/getUnavailabilityBetween', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {  
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT availability.player_id, availability.available, COUNT(*) FROM availability INNER JOIN player_clan ON player_clan.player_id = availability.player_id WHERE player_clan.clan_id='+clan_id+' AND availability.avail_date BETWEEN \''+request.body.begin_date+'\' AND \''+request.body.end_date+'\' GROUP BY availability.player_id, availability.available HAVING availability.available=false ORDER BY availability.available DESC', function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json(result.rows);
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
// TODO remove from player_battle vehicle varchar column in 1 of May
// CREATE TABLE battles (source bigint NOT NULL, type smallint NOT NULL, battle_date timestamp NOT NULL, map_id varchar(50) NOT NULL, winner smallint, version varchar(50), PRIMARY KEY(source));
// CREATE TABLE player_battle (player_id int NOT NULL, player_name varchar(50), source bigint NOT NULL, vehicle varchar(100), tank_id int, team smallint, isAlive boolean, points smallint);
// ALTER TABLE player_battle ADD CONSTRAINT p_battle UNIQUE (player_id, source);
// CREATE TABLE clan_battle (source bigint NOT NULL, clan_id int NOT NULL, opponent varchar(30) NOT NULL, commander_id int NOT NULL, team smallint, replay_link varchar(250), notes text);
// ALTER TABLE clan_battle ADD CONSTRAINT unique_clan_battle UNIQUE (source, clan_id);
// CREATE INDEX clan_battle_index ON clan_battle (clan_id);
// *?*?*?*?*?*?*?*?*?*?*?*?*?*?*?
// COMMANDER case
app.post('/processReplay', function (request, response) {
  if (isSqlInjection(request.body)) { 
    response.statusCode = 400;
    response.send({"type":'danger', "msg":'Invalid replay'});
  } else {
    var json = request.body;

    // TYPE: 1-random; 2-trening; 3-TankCompany; 4-Turnament; 5-CW; 7-Teambattle; 10-SH skirmish; 11-SH battle
    var battleType = json.description.battleType;
    var version = json.description.clientVersionFromXml;

    if (battleType == 2 || battleType == 5 || battleType == 7 || battleType == 10 || battleType == 11) {
      // supported types
    } else {
      response.send({"type":'danger', "msg":'Unsuported battle type: '+ battleType});
      return null;
    }

    if (json.details) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

              var source = json.details[0].arenaUniqueID;
              var commander_id = json.details[0].personal.accountDBID;
              var team = json.details[0].personal.team;
              var createTime = json.details[0].common.arenaCreateTime;
              var duration = json.details[0].common.duration;
              var winnerTeam = json.details[0].common.winnerTeam;              
              var isVehLock = json.details[0].common.vehLockMode == 1;
              var isVictory = (winnerTeam == team);
              var opponent = '';
              for (var acc_id in json.details[0].players) {
                var player = json.details[0].players[acc_id];
                if (player.clanAbbrev && player.clanAbbrev.length > 0 && player.team != team) {
                  opponent = player.clanAbbrev;
                  break;
                }
              }
              var map_id = json.description.mapName;
              var replay_link = json.replayLink;
              var notes = json.notes;
              
              client.query('SELECT * FROM battles WHERE source='+source, function(err, result) {
                done();
                if (!err) {
                   if (result.rows.length == 0) {

                    // 1. ADD Clan_Battle
                    client.query('INSERT INTO clan_battle (source, clan_id, opponent, commander_id, team, replay_link, notes) VALUES ('
                      +source+', '+clan_id+', \''+opponent+'\', '+commander_id+', '+team+', \''+replay_link+'\', \''+notes+'\')', function(err, result) {
                      done();
                      if (err)
                       { console.error(err); }
                    });

                    // 2. ADD Battles
                    client.query('INSERT INTO battles (source, type, battle_date, map_id, winner, version) VALUES ('
                        +source+', '+battleType+', to_timestamp('+createTime+'), \''+ map_id+'\', '+winnerTeam+', \''+ version +'\')', function(err, result) {
                      done();
                      if (err) { 
                        console.error(err);
                        response.send({"type":'warning', "msg":'Failed to uploaded replay \''+  json.description.dateTime+'\' '+json.description.mapDisplayName+' '+json.description.playerVehicle, "error":err, "data":request});
                      } else {
                        // 3. ADD Player_Battle
                        for (var pid in json.details[1]) {
                          var acc_id = json.details[0].vehicles[pid].accountDBID;
                          var points = json.details[0].vehicles[pid].fortResource;
                          var vhl = json.details[1][pid];

                          var vehicleTypeName;
                          var vehicle_id = 0;
                          var vehicleTier;
                          var vehicleClass;
                          
                          if (tanksMap[vhl.vehicleType]) {
                            vehicleTypeName = tanksMap[vhl.vehicleType].name;  
                            vehicle_id = tanksMap[vhl.vehicleType].tank_id;   
                            vehicleTier = tanksMap[vhl.vehicleType].tier;   
                            vehicleClass = tanksMap[vhl.vehicleType].type;   
                          } else {
                            vehicleTypeName = vhl.vehicleType;
                          }
                          client.query('INSERT INTO player_battle (player_id, player_name, source, vehicle, tank_id, team, isAlive, points) VALUES ('
                            +acc_id+', \''+vhl.name+'\', '+source+', \''+vehicleTypeName+'\', '+vehicle_id+', '+vhl.team+', '+vhl.isAlive+', '+points+')', function(err, result) {
                            done();
                            if (err)
                             { console.error(err); }
                          });
                        
                          if (isVehLock && !vhl.isAlive && (team == vhl.team) && vehicleClass) {
                            var fTime = 0;
                            var isProvinceCaptureBattle = json.replayType === 'capture';
                            var fTier = frozen['tier_'+vehicleTier];
                            var provinceType = json.provinceType; 
                            if (fTier) {
                              var fClass = fTier[vehicleClass];
                              if (fClass) {
                                var fBattle = isProvinceCaptureBattle ? "capture" : "other";                               
                                if (isProvinceCaptureBattle && isVictory) {                                  
                                  fTime = fClass[fBattle][provinceType];
                                } else {
                                  fTime = fClass[fBattle];
                                }
                              }
                            }                            
                            var frozenUntil = createTime + duration + fTime + 45;
                            // console.log('Frozen tank '+vehicleTypeName+'\t player_id:'+acc_id+'\ttank_id:'+vehicle_id+'\tf:'+fTime+'\td:'+duration+'\tc:'+createTime); 
                            client.query('UPDATE player_tank_stats SET frozenDate=to_timestamp('+frozenUntil+') WHERE player_id='+acc_id+' AND tank_id='+vehicle_id, function(err, result) {
                              done(); 
                            });
                          }

                        }
                        response.send({"type":'success',"msg":'Replay uploaded \''+json.description.dateTime+'\' '+json.description.mapDisplayName+' '+json.description.playerVehicle});
                      }
                    });
          

                  } else { // jest source 


                    client.query('SELECT * FROM clan_battle WHERE source='+source+' AND clan_id='+clan_id, function(err, result) {
                      done();
                      if (!err) {
                        if (result.rows.length == 0) {
                          // 1. ADD Clan_Battle
                          client.query('INSERT INTO clan_battle (source, clan_id, opponent, commander_id, team, replay_link, notes) VALUES ('
                            +source+', '+clan_id+', \''+opponent+'\', '+commander_id+', '+team+', \''+replay_link+'\', \''+notes+'\')', function(err, result) {
                            done();
                            if (err)
                             { console.error(err); }
                          });

                          // TODO 2. update Player_Battle table tylko dla klanu dodajacego

                          response.send({"type":'success',"msg":'Replay uploaded \''+json.description.dateTime+'\' '+json.description.mapDisplayName+' '+json.description.playerVehicle});
                        } else { // bitwa juz dodana
                          response.send({"type":'warning', "msg":'Replay already added. \''+  json.description.dateTime+'\' '+json.description.mapDisplayName+' '+json.description.playerVehicle});
                        }
                      }
                    });          
                    
                  }
                }
              });

            } else {
              //response.statusCode = 403;
              response.statusCode = 200;
              response.send({"type":'danger', "msg":'Insufficient permission to add replay. '+  json.description.dateTime+'\' '+json.description.mapDisplayName+' '+json.description.playerVehicle});
              
              console.log('[Insufficient permission] KEY '+result.rows[0].player_key +' =? '+json.key+'\n'+
                'isAdmin ? '+isAdmin(result.rows[0].admins, json.player_id)+'\t||\tisCommander ? '+isCommander(result.rows[0].commanders, json.player_id) );
            }
           }
        });
      });    
    } else {
      response.statusCode = 200;
      response.send({"type":'danger', "msg":'Replay file is invalid you have to be in battle until the end. '+  json.description.dateTime+'\' '+json.description.mapDisplayName+' '+json.description.playerVehicle});
    }
  }
});

app.post('/getPlayersBattleStats', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT player_battle.player_id, battles.type, COUNT(*), SUM(points) FROM clan_battle INNER JOIN battles ON battles.source = clan_battle.source INNER JOIN player_battle ON battles.source = player_battle.source WHERE clan_battle.clan_id='+clan_id+' AND battles.battle_date BETWEEN \''+json.begin_date+' 00:00\' AND \''+json.end_date+' 23:59\' GROUP BY player_battle.player_id, battles.type ORDER BY player_battle.player_id ASC', function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json(result.rows);
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

app.post('/getPlayersPresence', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT typeofbattleaspresent FROM clan_config WHERE clan_id='+clan_id, function(err, result) {
              done();
              if (err)
                { console.error(err); response.statusCode = 500; response.send(); }
              else
                { 
                  var battleTypeCondition = 'battles.type=0';
                  var types = '';
                  if (result.rows.length == 1) {
                    types = result.rows[0].typeofbattleaspresent;
                  }
                  if (types && types !== '') {
                    battleTypeCondition = '';
                    var typesArr = types.split(',');
                    for (var idx=0; idx<typesArr.length; idx++) {
                      var t = typesArr[idx];
                      if (t.length > 0) {
                        if (battleTypeCondition.length > 0) {
                          battleTypeCondition += ' OR '
                        }
                        battleTypeCondition += 'battles.type='+t;
                      }
                    }                
                  }
                  client.query('SELECT derivedtable.player_id, COUNT(derivedtable.player_id) FROM (SELECT player_battle.player_id, battles.battle_date::date, COUNT(*) FROM clan_battle INNER JOIN battles ON battles.source = clan_battle.source INNER JOIN player_battle ON clan_battle.source = player_battle.source WHERE clan_battle.clan_id='+clan_id+' AND ('+battleTypeCondition+') AND battles.battle_date BETWEEN \''+json.begin_date+' 00:00\' AND \''+json.end_date+' 23:59\' GROUP BY player_battle.player_id, battles.battle_date::date ORDER BY player_battle.player_id ASC) AS derivedTable GROUP BY derivedtable.player_id', function(err, result) {
                    done();
                    if (err)
                     { console.error(err); response.send(); }
                    else
                     { 
                      response.setHeader('Content-Type', 'application/json');
                      response.json(result.rows);
                     }
                  });

                }
              });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

app.post('/getPlayerBattles', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT clan_battle.opponent, battles.type, battles.battle_date, battles.map_id, battles.winner FROM clan_battle INNER JOIN battles ON battles.source = clan_battle.source INNER JOIN player_battle ON clan_battle.source = player_battle.source WHERE clan_battle.clan_id='+clan_id+' AND player_battle.player_id='+json.pid+' ORDER BY battle_date DESC', function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json(result.rows);
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

app.post('/getLastBattles', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    var opp = json.opponent;
    
    var additionalWHERE = '';
    if (json.opponent) {
      additionalWHERE += 'AND clan_battle.opponent=\''+json.opponent+'\' ';
    }
    if (json.map) {
      additionalWHERE += 'AND battles.map_id=\''+json.map.arena_id+'\' ';
    } 
    if (json.type && json.type != 0) {
      additionalWHERE += 'AND battles.type='+json.type+' ';
    }
    if (json.base === 1) {
      additionalWHERE += 'AND clan_battle.team=1 ';
    } else if (json.base === 2) {
      additionalWHERE += 'AND clan_battle.team=2 ';
    }

    pg.connect(process.env.DATABASE_URL, function(err, client, done) { 
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT battles.source, clan_battle.opponent, battles.type, battles.battle_date, battles.map_id, battles.winner, battles.version, clan_battle.commander_id, clan_battle.team, clan_battle.replay_link, clan_battle.notes FROM clan_battle INNER JOIN battles ON battles.source = clan_battle.source WHERE clan_battle.clan_id='+clan_id+' '+additionalWHERE+'ORDER BY battle_date DESC LIMIT '+json.number, function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json(result.rows);
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// COMMANDER case
app.post('/removeBattle', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) { 
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

            // TODO rework when multi clans avaliable
            client.query('DELETE FROM player_battle WHERE source='+json.source, function(err, result) {
              done();
              if (err) { 
                console.error(err); 
                response.setHeader('Content-Type', 'application/json');
                response.statusCode = 500;
                response.send({"type":'danger', "msg":'Failed replay not deleted', "db":"faild to delete from player_battle table"});
              } else {
                client.query('DELETE FROM battles WHERE source='+json.source, function(err, result) {
                  done();
                  if (err) { 
                    console.error(err); 
                    response.setHeader('Content-Type', 'application/json');
                    response.statusCode = 500;
                    response.send({"type":'danger', "msg":'Failed replay not deleted', "db":"faild to delete from battles table"});
                  } else { 
                    client.query('DELETE FROM clan_battle WHERE source='+json.source+' AND clan_id='+clan_id, function(err, result) {
                      done();
                      if (err) { 
                        console.error(err); 
                        response.setHeader('Content-Type', 'application/json');
                        response.statusCode = 500;
                        response.send({"type":'danger', "msg":'Failed replay not deleted', "db":"faild to delete from clan_battle table"});
                      } else { 
                        response.setHeader('Content-Type', 'application/json');
                        response.send({"type":'warning', "msg":'Replay deleted'});
                      }
                    });
                  }
                });
              }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// Commanders case
app.post('/battleDetails', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

            client.query('SELECT player_battle.player_id, player_battle.player_name, player_battle.vehicle, player_battle.team, player_battle.isAlive FROM clan_battle INNER JOIN player_battle ON clan_battle.source = player_battle.source WHERE clan_battle.clan_id='+clan_id+' AND clan_battle.source='+json.source, function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json({"source":json.source, "players": result.rows});
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// COMMANDER case
app.post('/changeCommander', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

            client.query('UPDATE clan_battle SET commander_id=\''+json.commander_id+'\' WHERE clan_id='+clan_id+' AND clan_battle.source='+json.source, function(err, result) {
              done();
              if (err)
               { console.error(err); 
                response.json({"source":json.source, "updated": false, "commander_id": json.player_id, "error": err}); 
               }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json({"source":json.source, "updated": true, "commander_id": json.player_id});
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// COMMANDER case
app.post('/saveReplayLink', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

            client.query('UPDATE clan_battle SET replay_link=\''+json.link+'\' WHERE clan_id='+clan_id+' AND clan_battle.source='+json.source, function(err, result) {
              done();
              if (err)
               { console.error(err); 
                response.json({"source":json.source, "updated": false}); 
               }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json({"source":json.source, "updated": true, "link": json.link});
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// COMMANDER case
app.post('/saveBattleReport', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {
      
            client.query('UPDATE clan_battle SET notes=\''+json.report+'\' WHERE clan_id='+clan_id+' AND clan_battle.source='+json.source, function(err, result) {
              done();
              if (err)
               { console.error(err); 
                response.json({"source":json.source, "updated": false, "error": err}); 
               }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json({"source":json.source, "updated": true});
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// CREATE SEQUENCE msg_id_seq;
// CREATE TABLE clan_message (id bigint DEFAULT nextval('msg_id_seq'), clan_id int NOT NULL, title varchar(100) NOT NULL, msg text, msg_time timestamp DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id));
app.post('/getClanMessages', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err) { 
          console.error(err); response.statusCode = 500; response.send();
        } else {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

          client.query('SELECT * FROM clan_message WHERE clan_id='+clan_id, function(err, result) {
            done();
            if (err)
             { console.error(err); response.send(); }
            else
             { 
              response.setHeader('Content-Type', 'application/json');
              response.json(result.rows);
             }
          });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// Commander case
app.post('/addClanMessage', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

            client.query('INSERT INTO clan_message (clan_id, title, msg) VALUES ('
                +clan_id+', \''+json.title+'\', \''+json.massage+'\')', function(err, result) {
              done();
              if (err)
               { console.error(err); 
                response.statusCode = 500;
                response.json({"updated": false}); 
               }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json({"updated": true});
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// Commander case
app.post('/removeMessage', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

            client.query('DELETE FROM clan_message WHERE clan_id='+clan_id+' AND id='+json.msgId, function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               {         
                response.send(result.rows); 
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    }); // connect
  }
});

// CREATE TABLE clan_config (clan_id int NOT NULL, accType smallint DEFAULT 0, availableDelay smallint DEFAULT 0, validDate timestamp, typeofbattleaspresent varchar(50) DEFAULT '2,5,10,11', availablePages smallint, commanders text, admins text, PRIMARY KEY(clan_id));
app.post('/clanConfig', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {   
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) {
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT * FROM clan_config WHERE clan_id='+clan_id, function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               {  
                if (result.rows.length == 0) {
                  // add trial period for new clan
                  var trialDate = new Date();
                  var time = (trialDate.getTime() + 2592000000)/1000;

                  updateWN8forClan(clan_id);

                  requestLib.post('https://api.worldoftanks.eu/wgn/clans/info/',
                    { form: 'application_id='+application_id+'&clan_id='+clan_id },
                      function (error, res, body) {
                          if (!error && res.statusCode == 200) {
                            var b = JSON.parse(body);
                            var members = b.data[clan_id].members;

                            var admins = '';
                            for (var i in members) {
                              if (members[i].role === 'executive_officer' || members[i].role === 'commander') {
                                if (admins.length > 0) {
                                  admins += ',';
                                }
                                admins += ''+members[i].account_id;
                              }
                            }

                            client.query('INSERT INTO clan_config (clan_id, accType, validDate, admins) VALUES ('
                                +clan_id+', 1, to_timestamp('+time+'), \''+admins+'\')', function(err, result) {
                              done();
                              if (err)
                               { console.error(err); 
                                response.send(); 
                               }
                              else
                               { 
                                client.query('SELECT * FROM clan_config WHERE clan_id='+clan_id, function(err, result) {
                                  done();
                                  if (err)  { 
                                    console.error(err); 
                                    response.send(); 
                                  } else {
                                    response.send(result.rows);  
                                  }
                                });
                               }
                            });

                          } else {
                            console.log('[ERROR] '+error);
                          }
                      }
                  ); // end of POST to WG           

                } else { // Clan config present just return it.
                  response.send(result.rows);  
                }
               }
            });

          } else { // key check faild
            response.statusCode = 403;
            response.send();
          }
        }
      });
    }); // pg.connect
  }
});

// ADMIN case
app.post('/setClanConfig', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && isAdmin(result.rows[0].admins, json.player_id) ) {

            client.query('UPDATE clan_config SET typeOfBattleAsPresent=\''+json.typeOfBattleAsPresent+'\', availabledelay='+json.availableDelay+' WHERE clan_id='+clan_id, function(err, result) {
              done();
              if (err)
               { console.error(err); 
                response.statusCode = 500;
                response.send();
               }
              else
               { response.statusCode = 200;
                response.send();
               }
            });
            
          } else {
            response.statusCode = 403;
            response.send();
          } 
          
         }
      });
    });
  }
});

// ADMIN case
app.post('/savePrivileges', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && isAdmin(result.rows[0].admins, json.player_id) ) {

            client.query('UPDATE clan_config SET admins=\''+json.admins+'\', commanders=\''+json.commanders+'\' WHERE clan_id='+clan_id, function(err, result) {
              done();
              if (err)
               { console.error(err); 
                response.statusCode = 500;
                response.send();
               }
              else
               { response.statusCode = 200;
                response.send();
               }
            });
            
          } else {
            response.statusCode = 403;
            response.send();
          } 
          
         }
      });
    });
  }
});

// CREATE TABLE player_clan (player_id int NOT NULL, player_key varchar(40) NOT NULL, clan_id int, PRIMARY KEY(player_id));
// CREATE INDEX player_clan_index ON player_clan (clan_id);
app.post('/auth', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          // add key for new player
          if (result.rows.length == 0) {
            requestLib.post(
              'https://api.worldoftanks.eu/wot/account/info/',
                { form: { 'application_id': application_id, 'account_id': json.player_id } },
                function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        var b = JSON.parse(body);
                        var clan_id = b.data[json.player_id]["clan_id"];
                        if (onlyNumberPattern.test(clan_id)) {                          

                          client.query('INSERT INTO player_clan (player_id, player_key, clan_id) VALUES ('
                              +json.player_id+', \''+json.key+'\', '+json.clanId+')', function(err, result) {
                            done();
                            if (err)
                             { console.error(err); response.statusCode = 500; response.send(); }
                            else
                             {
                              console.log('[INFO] Added new user id: '+json.player_id+' clan_id: '+clan_id+ ' key: '+json.key);     
                              response.statusCode = 200; 
                              response.send();                           
                             }
                          });

                        } else {
                          console.log('[ERROR] Invalid clan_id: '+clan_id);
                        }
                    } else {
                      console.log('[ERROR] '+error);
                    }
                }
            );            
          } else {
            if (result.rows[0].player_key === json.key) {
              response.statusCode = 200;
              response.send();
            } else {
              response.statusCode = 403;
              response.send();
            } 
          }
         }
      });
    });
  }
});

// Admin case
app.post('/loggedMembers', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;

          if (result.rows[0].player_key === json.key && isAdmin(result.rows[0].admins, json.player_id) ) {
 
            client.query('SELECT player_id FROM player_clan WHERE clan_id='+clan_id, function(err, result) {
              done();
              if (err)
               { console.error(err); response.statusCode = 500; response.send(); }
              else
               {
                response.statusCode = 200; 
                response.send(result.rows); 
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    });
  }
});

// CREATE SEQUENCE bm_id_seq;
// CREATE TABLE clan_bookmarks (id bigint DEFAULT nextval('bm_id_seq'), clan_id int NOT NULL, title varchar(100) NOT NULL, link text, icon smallint DEFAULT 0, PRIMARY KEY(id));
// CREATE INDEX clan_bookmarks_index ON clan_bookmarks (clan_id);
app.post('/getClanBookmarks', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM player_clan WHERE player_id='+json.player_id, function(err, result) {
        done();
        if (err) { 
          console.error(err); response.statusCode = 500; response.send();
        } else {  
          if (result.rows.length == 1 && result.rows[0].player_key === json.key) { 
            var clan_id = result.rows[0].clan_id;

            client.query('SELECT * FROM clan_bookmarks WHERE clan_id='+clan_id, function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json(result.rows);
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// ADMIN case
app.post('/addClanBookmark', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && isAdmin(result.rows[0].admins, json.player_id) ) {

            client.query('INSERT INTO clan_bookmarks (clan_id, title, link, icon) VALUES ('
                +clan_id+', \''+json.title+'\', \''+json.link+'\', '+json.number+')', function(err, result) {
              done();
              if (err)
               { console.error(err); 
                response.statusCode = 500;
                response.json({"updated": false}); 
               }
              else
               { 
                response.setHeader('Content-Type', 'application/json');
                response.json({"updated": true});
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// ADMIN case
app.post('/removeClanBookmark', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && isAdmin(result.rows[0].admins, json.player_id) ) {

            client.query('DELETE FROM clan_bookmarks WHERE clan_id='+clan_id+' AND id='+json.id, function(err, result) {
              done();
              if (err)
               { console.error(err); response.send(); }
              else
               {         
                response.send(result.rows); 
               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
         }
      });
    }); // connect
  }
});


// CREATE TABLE player_note (player_id int, clan_id int, note text, PRIMARY KEY(player_id));
// CREATE INDEX player_note_index ON player_note (clan_id);
// Commander case
app.post('/getPlayersNotes', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

              client.query('SELECT player_id, note FROM player_note WHERE clan_id='+clan_id, function(err, result) {
                done();
                if (err)
                 { console.error(err); response.send(); }
                else
                 { 
                  response.setHeader('Content-Type', 'application/json');
                  response.json(result.rows);
                 }
              });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// Commander case
app.post('/setPlayersNotes', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

            client.query('SELECT * FROM player_note WHERE player_id='+json.pid, function(err, result) {
              done();
              if (err)
               { console.error(err); 
                response.statusCode = 500;
                response.json({"updated": false}); 
               }
              else
               { 
                if (result.rows.length == 0) {

                  client.query('INSERT INTO player_note (player_id, clan_id, note) VALUES ('
                      +json.pid+', '+clan_id+',\''+json.note+'\')', function(err, result) {
                    done();
                    if (err)
                     { console.error(err); 
                      response.statusCode = 500;
                      response.json({"inserted": false}); 
                     }
                    else
                     { 
                      response.setHeader('Content-Type', 'application/json');
                      response.json({"inserted": true});
                     }
                  });

                } else {

                  client.query('UPDATE player_note SET note=\''+json.note+'\' WHERE player_id='+json.pid, function(err, result) {
                    done();
                    if (err)
                     { console.error(err); 
                      response.statusCode = 500;
                      response.json({"updated": false}); 
                     }
                    else
                     { 
                      response.setHeader('Content-Type', 'application/json');
                      response.json({"updated": true});
                     }
                  });

                }

               }
            });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// CREATE SEQUENCE tactics_id_seq;
// CREATE TABLE clan_tactics (id bigint DEFAULT nextval('tactics_id_seq'), clan_id int NOT NULL, author varchar(60), update_date timestamp DEFAULT CURRENT_TIMESTAMP, map_id varchar(50) NOT NULL, title varchar(150), base varchar(30), type varchar(30), link varchar(250), tanks text, description text, PRIMARY KEY(id));
// CREATE INDEX clan_tactics_index ON clan_tactics (clan_id);
// Commander case
app.post('/saveTactic', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

              if (json.tactic.id) {
                client.query('UPDATE clan_tactics SET title=\''+json.tactic.title+'\', base=\''+json.tactic.baseText+'\', type=\''+json.tactic.typeText+
                  '\', link=\''+json.tactic.link+'\', tanks=\''+json.tactic.tanks+'\', description=\''+json.tactic.description+'\', update_date=CURRENT_TIMESTAMP WHERE id='+json.tactic.id, function(err, result) {
                  done();
                  if (err)
                   { console.error(err); 
                    response.statusCode = 500;
                    response.json({"updated": false}); 
                   }
                  else
                   { 
                    response.setHeader('Content-Type', 'application/json');
                    response.json({"updated": true});
                   }
                });
              } else {
                client.query('INSERT INTO clan_tactics (clan_id, author, map_id, title, base, type, link, tanks, description) VALUES ('
                    +clan_id+',\''+json.author+'\',\''+json.tactic.map.arena_id+'\',\''+json.tactic.title+'\',\''+json.tactic.baseText+'\',\''
                    +json.tactic.typeText+'\',\''+json.tactic.link+'\',\''+json.tactic.tanks+'\',\''+json.tactic.description+'\')', function(err, result) {
                  done();
                  if (err)
                   { console.error(err); 
                    response.statusCode = 500;
                    response.json({"inserted": false}); 
                   }
                  else
                   { 
                    response.setHeader('Content-Type', 'application/json');
                    response.json({"inserted": true});
                   }
                });
              }

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// Commander case
app.post('/removeTactic', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

              client.query('DELETE FROM clan_tactics WHERE id='+json.id, function(err, result) {
                done();
                if (err)
                 { console.error(err); 
                  response.statusCode = 500;
                  response.json({"deleted": false}); 
                 }
                else
                 { 
                  response.setHeader('Content-Type', 'application/json');
                  response.json({"deleted": true});
                 }
              });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// Commander case
app.post('/getTactics', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

              client.query('SELECT * FROM clan_tactics WHERE clan_id='+clan_id, function(err, result) {
                done();
                if (err)
                 { console.error(err); response.send(); }
                else
                 { 
                  response.setHeader('Content-Type', 'application/json');
                  response.json(result.rows);
                 }
              });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// CREATE SEQUENCE clan_note_id_seq;
// CREATE TABLE clan_note (id bigint DEFAULT nextval('clan_note_id_seq'), clan_id int NOT NULL, opponent varchar(30), update_date timestamp DEFAULT CURRENT_TIMESTAMP, map_id varchar(50), title varchar(150), description text, PRIMARY KEY(id));
// CREATE INDEX clan_note_index ON clan_note (clan_id);
// Commander case
app.post('/saveClanNote', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

              if (!json.note.id) { // nowa notatka
                var isMap = json.note.map ? 'map_id, ' : '';
                var mapValue = json.note.map ? '\''+json.note.map.arena_id+'\',' : '';
                client.query('INSERT INTO clan_note (clan_id, opponent, '+isMap+'title, description) VALUES ('
                    +clan_id+',\''+json.note.teamName+'\','+mapValue+'\''+json.note.title+'\',\''+json.note.description+'\')', function(err, result) {
                  done();
                  if (err)
                   { console.error(err); 
                    response.statusCode = 500;
                    response.json({"inserted": false}); 
                   }
                  else
                   { 
                    response.setHeader('Content-Type', 'application/json');
                    response.json({"inserted": true});
                   }
                });
              } else { // edycja istniejacej
                client.query('UPDATE clan_note SET description=\''+ json.note.description +'\', update_date=CURRENT_TIMESTAMP WHERE id='+json.note.id, function(err, result) {
                  done();
                  if (!err) {
                    response.statusCode = 200;
                    response.send();
                  } else {
                    console.error(err);
                  }
                });
              }

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// Commander case
app.post('/getClanNotes', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

              var additionalWHERE = '';
              if (json.map) {
                additionalWHERE += 'AND map_id=\''+json.map.arena_id+'\' ';
              } 
              client.query('SELECT * FROM clan_note WHERE clan_id='+clan_id+' AND opponent=\''+json.opponent+'\' '+additionalWHERE, function(err, result) {
                done();
                if (err)
                 { console.error(err); response.send(); }
                else
                 { 
                  response.setHeader('Content-Type', 'application/json');
                  response.json(result.rows);
                 }
              });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});

// Commander case
app.post('/removeNote', function (request, response) {
  if (isSqlInjection(request.body)) {
    response.statusCode = 400;
    response.send();
  } else {
    var json = request.body;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT pc.clan_id, pc.player_key, cc.admins, cc.commanders FROM player_clan pc INNER JOIN clan_config cc ON pc.clan_id=cc.clan_id WHERE pc.player_id='+json.player_id, function(err, result) {
        done();
        if (err)
         { console.error(err); response.statusCode = 500; response.send(); }
        else
         {  
          var clan_id = result.rows[0].clan_id;
          if (result.rows[0].player_key === json.key && 
            (isAdmin(result.rows[0].admins, json.player_id) || isCommander(result.rows[0].commanders, json.player_id)) ) {

              client.query('DELETE FROM clan_note WHERE id='+json.id, function(err, result) {
                done();
                if (err)
                 { console.error(err); 
                  response.statusCode = 500;
                  response.json({"deleted": false}); 
                 }
                else
                 { 
                  response.setHeader('Content-Type', 'application/json');
                  response.json({"deleted": true});
                 }
              });

          } else {
            response.statusCode = 403;
            response.send();
          }
        }
      });
    });
  }
});
