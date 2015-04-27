// var path = require('path');
// var rootPath = path.normalize(__dirname + '/../../');

// module.exports = {
//   development: {
//     db: 'mongodb://localhost/multivision',
//     rootPath: rootPath,
//     port: process.env.PORT || 3030
//   },
//   production: {
//     rootPath: rootPath,
//     db: 'mongodb://jeames:multivision@ds053178.mongolab.com:53178/multivision',
//     port: process.env.PORT || 80
//   }
// }


var path = require('path');
var rootPath = path.normalize(__dirname +'/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/kssenior_db',
    rootPath: rootPath,
    port: process.env.PORT || 5000
  },
  production: {
    db: 'mongodb://senior_admin:beryl_radom@ds037601.mongolab.com:37601/kssenior_db',
    rootPath: rootPath,
    port: process.env.PORT || 5000
  }
}
