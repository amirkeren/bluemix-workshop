/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

const DATABASE_ERROR = 'Database undefined';
const PARAMETER_ERROR = 'Parameter is missing';

// this application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// bodyParser provides access to the query request parameters
var bodyParser = require('body-parser');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// for parsing request parameters
app.use(bodyParser.urlencoded({
  extended: true
}));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

// will hold the database object
var db;

//endpoint for retrieving all phrases
app.get('/getPhrases', function(req, res) {
  var result = 'No Phrases Found';
  if (db == null) {
    console.log(DATABASE_ERROR);
    res.send(result);
    return;
  }
  db.list({ include_docs: true }, function(err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      result = '';
      for (var i = 0; i < data.total_rows; i++) {
        result += '<li>' + data.rows[i].id + '</li>';
      }
    }
    res.send(result);
  });
});

//endpoint for adding a new phrase
app.post('/addPhrase', function(req, res) {
  if (db == null) {
    console.log(DATABASE_ERROR);
    res.sendStatus(500);
    return;
  }
  var value = req.body.value;
  if (value == null) {
    console.log(PARAMETER_ERROR);
    res.sendStatus(500);
    return;
  }
  db.insert({ _id: value }, function(err, data) {
    if (err) {
      console.log("Document already exists. Error: ", err);
      res.sendStatus(500);
    } else {
      console.log("Inserted new document");
      res.sendStatus(200);
    }
  });
});

var Cloudant = require('cloudant');

var cloudant_url;
//check if services are bound to your project
if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);
  //check if CloudantNoSQLDB service is bound to your project
    if (services.cloudantNoSQLDB)
        cloudant_url = services.cloudantNoSQLDB[0].credentials.url;
}

//check that we have a valid Cloudant url
if (cloudant_url == null)
  console.log(DATABASE_ERROR);
else {
  //connect using cloudant npm and URL obtained from previous step
  var cloudant = Cloudant({ url: cloudant_url });
  //create databases
  cloudant.db.create('translations', function(err, data) {
        if (!err)
          console.log("Created database");
  });
  var dbname = 'phrases';
  cloudant.db.create(dbname, function(err, data) {
        if (!err)
          console.log("Created database");
        db = cloudant.db.use(dbname);
  });
}
