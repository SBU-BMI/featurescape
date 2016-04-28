// find API for featurescape applications
var mongoClient = require('mongodb').MongoClient;
var http = require("http");
var url = require("url");
var util = require("util");
var port = 3000;

var mongoUrl = 'mongodb://<uname>:<passwd>@<domain>:<port>/<db>'; // <-- default mongo
var collection = '<collection name>'; // <-- default collection

function handleRequest(request, response) {
    if (request.url != '/favicon.ico') {
        console.log("Client IP: " + request.ip);
        console.log("Client Address: " + request.connection.remoteAddress);
        var more = url.parse(request.url);
        //console.log(more)
        var parms = {}; // search parms
        if (more.search) { // parse request parameters
            more.search.slice(1).split('&').forEach(function (pp) {
                pp = pp.split('=');
                if (parseFloat(pp[1])) {
                    pp[1] = parseFloat(pp[1]);
                }
                parms[pp[0]] = pp[1];
            })
        }
        // default parameter values
        var max = 10000; // maximum number of records at a time
        var med = 0; // default number of records at a time
        if (!parms.limit) {
            parms.limit = med;
            response.end("");
            console.log("Request with no limit parameter!");
            return;
        }

        if (parms.limit == 0) {
            response.end("");
            console.log("Request with limit==0!");
            return;
        }

        if (parms.limit > max) {
            parms.limit = max;
        }

        if (!parms.mongoUrl) {
            parms.mongoUrl = mongoUrl;
        } // <-- default mongo

        if (!parms.collection) {
            parms.collection = collection;
        } // <-- default collection

        if (!parms.find) { // find
            parms.find = {};
        } else {
            try {
                // recode operators
                parms.find = JSON.parse(decodeURI(parms.find));
            } catch (err) {
                parms.err = {
                    error: err
                };
                console.log(err);
            }
        }

        if (!parms.project) { // project
            parms.project = {};
        } else {
            try {
                // recode operators
                parms.project = JSON.parse(decodeURI(parms.project));
            } catch (err) {
                parms.err = {
                    error: err
                };
                console.log(err);
            }
        }

        response.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });

        if (!parms.err) {
            console.log('connecting ...');
            console.log('parms.mongoUrl: ' + parms.mongoUrl);
            console.log('parms.collection: ' + parms.collection);
            console.log('parms.find: ' + util.inspect(parms.find));
            console.log('parms.find: ' + util.inspect(parms.project));
            console.log('parms.limit: ' + parms.limit);
            setTimeout(function () { // count down to quitting
                response.end('{error: "this is taking too long, please email jonas.almeida@stonybrook.edu to find out what is the holdup :-("}')
            }, 25000);
            mongoClient.connect(parms.mongoUrl, function (err, db) {

                if (err) {
                    console.log('Unable to connect to the MongoDB server. Error: ', err);
                } else {
                    console.log('connected ... retrieving documents ...');

                    db.collection(parms.collection).find(parms.find, parms.project, {
                        limit: parms.limit
                    }).toArray(function (err, docs) {
                        if (docs != null) {
                            console.log(new Date, docs.length + ' docs');
                            db.close();
                            response.end(JSON.stringify(docs));
                        } else {
                            console.log(new Data, 'No results.');
                            db.close();
                            response.end(JSON.stringify({}));
                        }
                    })
                }

            })
        } else {
            response.end('{error: ' + parms.err.error.message + '}');
            console.log(parms.err);
        }
    } else {
        response.end(''); //<-- favicon being requested
    }
}

var server = http.createServer(handleRequest);
server.listen(port, function () {
    //console.log('listening on port ' + port);
    console.log('http://localhost:' + port);
});
