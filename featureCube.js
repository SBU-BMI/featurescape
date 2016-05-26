// Developing OLAP data cube operations as per https://en.wikipedia.org/wiki/OLAP_cube
// Oerations: slicong, dicing, drull-up/down, pivoting
// All the work is done at firebase 

featureCube=function(){
  
  this.hello=function(){
    console.log('hello')
  }

  this.info={
    created:new Date,
    log:[]
  }

  this.slice=function(){

  }

  this.dice=function(){
    
  }

  this.drillUp=function(){
    
  }

  this.drillDown=function(){
    
  }

  this.pivot=function(){
    
  }



};

featureCube.hello=function(){ // say hello in the DOM
  document.body.innerHTML+='Hello at '+new Date()
  4
}




(function(){ // leaving the global scope
  console.log('featureCube.js loaded');



})()
