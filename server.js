// find API for featurescape applications

var MongoClient = require('mongodb').MongoClient;
var http = require("http");
var url = require("url");
var port=3000

http.createServer(function(request, response) {
  if(request.url!='/favicon.ico'){
    var more = url.parse(request.url)
    //console.log(more)
    var parms={} // search parms
    if(more.search){ // parse request parameters
      more.search.slice(1).split('&').forEach(function(pp){
        pp=pp.split('=')
        if(parseFloat(pp[1])){pp[1]=parseFloat(pp[1])}
        parms[pp[0]]=pp[1]
      })
    }
    // default parameter values
    var max=10 // maximim number of records at a time
    if(!parms.limit){parms.limit=max}
    if(parms.limit>max){parms.limit=max}
    if(!parms.mongoUrl){parms.mongoUrl='mongodb://<uname>:<passwd>@<domain>:<port>/<db>'} // <-- default mongo
    if(!parms.find){ // find
      parms.find={}
    }else{
      try{
        // recode operators
        parms.find=JSON.parse(decodeURI(parms.find))
      } catch (err) {
        parms.err={error:err}
        console.log(err)
      }
    } 
    console.log(parms)
    response.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"});
    if(!parms.err){
      console.log('conecting ...')
      setTimeout(function(){ // count down to quiting
        response.end('{error: "this is taking too long, please email jonas.almeida@stonybrook.edu to find out what is the holdup :-("}')
      },25000)
      MongoClient.connect(mongoUrl, function(err, db) {
        console.log('connected ... retrieving documents ...')
        db.collection('objects').find(parms.find,{},{limit:parms.limit}).toArray(function(err,docs){
          console.log(new Date,docs.length+' docs')
          db.close();
          response.end(JSON.stringify(docs));
        })   
      })
    }else{
      response.end('{error: '+parms.err.error.message+'}')
      console.log(parms.err)
    }
  }else{
    response.end('') //<-- favicon being requested
  }
}).listen(port);
console.log('listening on port '+port)

