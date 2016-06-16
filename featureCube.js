// Developing OLAP data cube operations as per https://en.wikipedia.org/wiki/OLAP_cube
// Oerations: slicong, dicing, drull-up/down, pivoting
// All the work is done at firebase 

featureCube=function(){
  
  this.hello=function(){ // (new featureCube).hello() is the same as featureCube.hello()
    featureCube.hello()
  }

  this.log={ // log book entry
    created:new Date,
    this:this
  }
  featureCube.logBook.push(this.log) // filing entry

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
  //document.body.innerHTML+='Hello at '+new Date()
  console.log('hello at '+new Date())
  if(document.body){
    //document.body.innerHTML='hello at '+new Date()
    var div = document.createElement('div')
    div.className='container' // in case bootstrap is available
    div.innerHTML='<span style="color:green">Hello from <i><a href="https://github.com/SBU-BMI/featurescape/blob/gh-pages/featureCube.js" target="_blank">featureCube</a></i> at </span> '+new Date()
    div.style.color="navy"
    div.style.fontSize="large"
    document.body.appendChild(div)
    4
  }else{
    console.log('DOM not ready at '+new Date())
    setTimeout(featureCube.hello,200)
  }
  //console.log('hello at '+new Date())
  4
};

featureCube.loadScript=function(url,cb,er){ // load script / JSON
	var s = document.createElement('script');
	s.src=url;
	//s.id = this.uid();
	if(!!cb){s.onload=cb}
	if(!!er){s.onerror=er}
	document.body.appendChild(s);
	setTimeout(function(){
		document.body.removeChild(s); // is the waiting still needed ?
	},5000)
	return s.id
};

featureCube.loadScripts=function(urls,cb,er){ // loading multiple scripts sequentially, runn callback after the last one is loaded
	console.log('loading script '+urls[0]+' ...');
	if (urls.length>1){featureCube.loadScript(urls[0],function(){jmat.loadScripts(urls.slice(1))})} // recursion
	else {featureCube.loadScript(urls[0],cb,er)}
};

featureCube.fire=function(fun){ // run a function that needs the firebase connection
  if(typeof(fun)=='undefined'){
  	fun=function(){console.log(this)}
  }
  if(typeof(firebase)=='undefined'){
  	featureCube.loadScript('https://www.gstatic.com/firebasejs/live/3.0/firebase.js',function(){
  		var config = {
			apiKey: "AIzaSyBRuEmdhErMaLXLhhv1Ax4eaUuMGmNBbDY",
			authDomain: "stone-ground-104117.firebaseapp.com",
			databaseURL: "https://stone-ground-104117.firebaseio.com",
			storageBucket: "stone-ground-104117.appspot.com",
	  	};
	  	// based on https://github.com/firebase/FirebaseUI-Web
	  	featureCube.firebase={app:firebase.initializeApp(config)};
	  	featureCube.firebase.auth=featureCube.firebase.app.auth();
	  	//featureCube.firebase.ui = new firebase.auth.AuthUI(featureCube.firebase.auth);
	  	
	  	fun()
  	})
  }else{
  	fun()
  }
};

featureCube.logBook=[]; // log book of all cubes 




(function(){ // leaving the global scope
  console.log('featureCube.js loaded');



})()
